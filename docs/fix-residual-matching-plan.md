# Fix `applyCommissionIdCandidatesFilter` — Piano completo

## Contesto

La funzione `applyCommissionIdCandidatesFilter` in `app/Repositories/CommissionRepository.php` (linea 4229) usa `whereIn($column, $candidates)` per matchare valori in colonne `order_id` e `user_payment_id` che sono di tipo **JSON** in MySQL.

Il match esatto fallisce a volte (formati JSON diversi: `[119]` vs `"[119]"` vs `["119"]`), causando:
- Duplicate residual_matching (2.831 righe spazzatura ripulite con cleanup notturno)
- Potenziale calcolo errato del matching bonus
- Refund che non sincronizza correttamente lo status RM
- Loop di compressione rank che non trova le righe stale

## Patch proposta

```php
private function applyCommissionIdCandidatesFilter($query, string $column, array $candidates)
{
    if (empty($candidates)) {
        return $query->whereRaw('1=0');
    }

    return $query->where(function ($q) use ($column, $candidates) {
        // Match esatto (compat retrocompat con varianti già coperte)
        $q->whereIn($column, $candidates);

        // OR via JSON_CONTAINS per match su colonne JSON
        foreach ($candidates as $c) {
            if ($c === null || $c === '') continue;
            // Skip i candidati che sono già format JSON (gestiti da whereIn)
            if (is_string($c) && strlen($c) > 0 && $c[0] === '[') continue;

            if (is_numeric($c)) {
                $q->orWhereRaw("JSON_CONTAINS({$column}, ?)", [json_encode((int) $c)]);
                $q->orWhereRaw("JSON_CONTAINS({$column}, ?)", [json_encode((string) $c)]);
            } else {
                $q->orWhereRaw("JSON_CONTAINS({$column}, ?)", [json_encode((string) $c)]);
            }
        }
    });
}
```

## Punti di chiamata (impatto)

| File:linea | Contesto | Effetto del fix |
|---|---|---|
| CommissionRepository.php:3957 | Trova residual_bonus sorgente per matching | Ora trova SEMPRE la sorgente → calcoli più accurati |
| CommissionRepository.php:4090 | Check exist residual_matching prima di INSERT | **Risolve duplicate** (effetto principale visibile) |
| CommissionRepository.php:4117 | Cerca duplicate da DELETE | Pulisce anche duplicate vecchie |
| CommissionRepository.php:4156 | Cancella stale rows | Mantiene tabella pulita |
| CommissionRepository.php:4250 | Update status RM da refund flow | **Risolve refund non sincronizzato** |
| CommissionRepository.php:4378 | Trova residual_bonus controllo | Loop interno corretto |

## Backup eseguiti (data/ora `20260429_164016`)

```
/home/forge/api.myevea.com/current/app/Repositories/CommissionRepository.php.bak.20260429_164016
/tmp/commission_residual_backup_20260429_164016.sql
```

## Test plan post-deploy

Ogni test va eseguito su staging o monitorato in produzione dopo il deploy.

### Test 1 — Crea ordine smartship → verifica RM
- Aspettativa: 1 sola riga RM per ogni leg/depth, no duplicate
- Query verifica:
  ```sql
  SELECT COUNT(*) FROM commission 
  WHERE payment_type='residual_matching' AND from_id=<earner_id>
  AND order_id LIKE '%<order_id>%' AND payment_status != 'cancelled'
  GROUP BY note;
  ```
  Deve restituire 1 riga per ogni note value.

### Test 2 — Re-run cron `residual:recalculate-monthly`
- Aspettativa: count totale RM resta uguale (no nuove righe spazzatura)
- Query: `SELECT COUNT(*) FROM commission WHERE payment_type='residual_matching'` prima e dopo

### Test 3 — Refund completo di un ordine
- Aspettativa: tutte le RM relative passano a `cancelled`, importi → 0
- Verifica: stesso order_id, status='cancelled' per tutte

### Test 4 — Refund parziale di un ordine (es. 50%)
- Aspettativa: importi RM ridotti del 50%, status resta `pending`/`yes`
- Verifica: confronto importi pre/post refund

### Test 5 — Compressione rank
- Cambio rank di un user → ricalcolo matching
- Aspettativa: vecchie RM cancelled, nuove pending con depth corretto

### Test 6 — Performance
- Tempo esecuzione cron `residual:recalculate-monthly` prima vs dopo
- Aspettativa: tempo stabile o migliorato (no INSERT spreco)

## Rollback plan

Se il fix introduce regressioni:

```bash
ssh ubuntu@57.131.21.48 "sudo cp \\
  /home/forge/api.myevea.com/current/app/Repositories/CommissionRepository.php.bak.20260429_164016 \\
  /home/forge/api.myevea.com/current/app/Repositories/CommissionRepository.php && \\
  sudo chown forge:forge /home/forge/api.myevea.com/current/app/Repositories/CommissionRepository.php && \\
  cd /home/forge/api.myevea.com/current && sudo php artisan cache:clear"
```

Ripristina backup. Il workaround `commission:cleanup-garbage` resta attivo come safety net.

## Strategia deploy

### Opzione A — Big bang (rapida, più rischiosa)
1. Deploy patch
2. Aspetta esecuzione cron 02:00 prossima notte
3. Verifica al mattino: nessuna riga garbage nuova generata
4. Se OK per 7 giorni → rimuovi `commission:cleanup-garbage` dal scheduler
5. Se KO → rollback

### Opzione B — Graduale (più sicura)
1. Deploy patch
2. Mantieni cleanup attivo come safety net
3. Aspetta 14 giorni di osservazione
4. Verifica:
   - Nessuna nuova riga spazzatura
   - Refund flow funziona correttamente
   - Calcolo matching consistente
5. Se tutto OK → rimuovi cleanup
6. Se KO → rollback (cleanup compensa nel frattempo)

**Raccomandazione**: Opzione B. Il workaround attuale fa zero danno e dà finestra di osservazione.

## Stato

- [x] Analisi impatto completata
- [x] Backup file controller
- [x] Backup snapshot residual data
- [x] Patch preparata (vedi sopra)
- [x] Test plan definito
- [x] Rollback plan documentato
- [ ] Deploy patch (attende OK)
- [ ] Monitoraggio 14 giorni
- [ ] Rimozione cleanup workaround (se patch ok)

# Fix — Residual bonus: customer non contano come livelli compressi

## Bug

Nel `recalculateResidualMonthly` di `CommissionRepository.php`, il loop di compressione contava ogni customer del path come 1 livello separato. Effetto: una catena di customer sotto un promoter qualificato gonfiava artificialmente la depth percepita, portando i buyer a livelli più profondi del corretto.

## Caso reale (alo Blue Diamond)

Path da `cliente.livello439` ad `alo`:

```
cliente.livello439 (cust)
 ← 6 customer in fila (depth 2-6)
 ← lillidog (promoter, PQV=0) → SKIP
 ← emanuela11 (qualified, PQV=960) +1
 ← francesca11 (PQV=0) → SKIP
 ← elio11 (qualified, PQV=150k) +1
 ← cerso2 (qualified, PQV=60) +1
 ← balle (PQV=0) → SKIP
 ← alo
```

- **Prima del fix**: cliente.livello439 al level **9** (5 customer + 3 qualified promoter + 1 = 9)
- **Dopo il fix**: cliente.livello439 al level **4** (3 qualified promoter + 1 = 4)

emanuela11 (primo qualified upline del cluster customer) è al level 3 dal punto di vista di alo, quindi i suoi sub-buyer attached devono essere al level 4 — non level 9.

## Codice modificato

`app/Repositories/CommissionRepository.php` linea ~4720:

**Prima:**
```php
if ($pathUser && (int) $pathUser->is_promoter === 1) {
    $pathPqv = (float) $this->getPQV($current, $start, $end);
    if ($pathPqv >= 50) {
        $levels++;
    }
} else {
    // Customer or other: always count as a level
    $levels++;
}
```

**Dopo:**
```php
if ($pathUser && (int) $pathUser->is_promoter === 1) {
    $pathPqv = (float) $this->getPQV($current, $start, $end);
    if ($pathPqv >= 50) {
        $levels++;
    }
}
// Customer or other (non-promoter): SKIP — sono buyer attached al primo
// qualified upline, non contano come livelli a se' stanti.
```

## Effetto verificato post-deploy

| Level | Prima | Dopo |
|---|---|---|
| 4 | 19 commission, €1109.10 | **20 commission, €1608.60** |
| 8 | vuoto | vuoto |
| 9 | 1 commission (cliente 69), €166.50 | vuoto ✓ |

Il buyer al level 4 ora include cliente.livello439, e il bonus è 1.5% (level 4) invece di 0.5% (level 9) — più favorevole all'upline.

## Backup

`/home/forge/api.myevea.com/current/app/Repositories/CommissionRepository.php.bak.20260429_201539`

## Rollback

```bash
ssh ubuntu@57.131.21.48 "sudo cp \\
  /home/forge/api.myevea.com/current/app/Repositories/CommissionRepository.php.bak.20260429_201539 \\
  /home/forge/api.myevea.com/current/app/Repositories/CommissionRepository.php && \\
  cd /home/forge/api.myevea.com/current && sudo php artisan cache:clear && \\
  sudo php artisan residual:recalculate-monthly"
```

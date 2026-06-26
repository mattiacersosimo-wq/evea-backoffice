# EVEA backoffice — context per Claude

Questo file viene letto automaticamente da Claude all'apertura del progetto.
Serve a dare contesto in qualunque ambiente (PC, Mac, nuovo computer)
senza dipendere dalle memorie persistenti server-side legate a un singolo path.

---

## Utente

- **Nome**: Mattia Cersosimo (mattiacersosimo@gmail.com)
- Founder / responsabile tecnico di EVEA Global S.r.l.
- Lavora autonomamente sul codice con Claude come partner tecnico.
- Stile preferito: risposte concise, dirette, niente fronzoli. Conferma prima di azioni rischiose.

## Cos'è EVEA

EVEA Global S.r.l. è un'azienda Italiana di **caffè wellness** distribuita con modello **MLM / Network Marketing** (vendita a domicilio, L. 173/2005). Lancio commerciale del network: **10 giugno 2026**.

- Sito storefront: `myevea.com` (Shopify)
- Backoffice promoter: `backoffice.myevea.com`
- API Lumen: `api.myevea.com`

## Architettura

| Componente | Tecnologia | Path locale | Repo GitHub |
|---|---|---|---|
| Frontend backoffice | React + MUI v5 (Minimal Kit) | `evea-backoffice-clean/` | `mattiacersosimo-wq/evea-backoffice` |
| Backend API | Lumen (PHP) + MySQL | `evea-backend-src/` | `mattiacersosimo-wq/evea-backend` |
| Shopify storefront | Liquid (gestito da Shopify) | — | — |
| Community | parte del backend, controller dedicati | `app/Http/Controllers/Community/` | (nel repo backend) |

## Server di produzione (VPS OVH)

- SSH: `ssh ubuntu@57.131.21.48`
- Backend Lumen live: `/home/forge/api.myevea.com/current/`
- Frontend backoffice live: `/home/forge/backoffice.myevea.com/current/build/` (release symlink atomico)
- Frontend backoffice staging: `/home/forge/staging.backoffice.myevea.com/current/build/` (stesso pattern; punta allo STESSO backend prod, quindi non usarlo per azioni distruttive su DB live)
- DB MySQL: database `office_db`, user `forge` (password in `.env`)
- Deploy frontend: `scripts/deploy.sh staging|prod` (build locale → `tar` → `scp` → atomic `ln -sfn` su `current` → cleanup release vecchie >10)
- Rollback rapido: `scripts/rollback.sh staging|prod` (lista release e ripristina quella scelta in 2 secondi)
- Deploy backend: modifiche fatte direttamente sul VPS via SSH (con `.bak.*` backup pre-modifica), poi commit/push su GitHub quando stabile.

## Workflow staging (testa prima di prod)

Lo staging serve a vedere il backoffice esattamente come lo vedrà l'utente PRIMA che il codice arrivi a `backoffice.myevea.com`. Indispensabile per refactor visuali (libreria UI, layout, traduzioni) — il browser ne mostra subito eventuali rotture che la build non rileva.

1. Lavora su un branch dedicato: `git checkout -b refactor/<scope>`
2. Builda e pubblica in staging: `./scripts/deploy.sh staging`
3. Apri `https://staging.backoffice.myevea.com` e clicca ogni pagina toccata dal cambio (login condiviso con prod — basta lo stesso utente)
4. Se OK → merge su `main` e poi `./scripts/deploy.sh prod`
5. Se rotto → rollback non serve (staging non impatta utenti), fix nel branch e ridepoloya staging

Limiti del setup attuale:
- Staging punta al backend prod (`api.myevea.com`) → ogni POST/PUT modifica il DB live. Usa solo l'utente di test e NON cliccare "approva/cancella/rimborsa" su record reali.
- Se in futuro serve isolamento totale (DB+backend di test), si clona `api.myevea.com` → `staging-api.myevea.com` con `office_db_staging`.

## Provider esterni

- **Shopify**: storefront + checkout + webhook ordini → `/api/wp/shopify-checkout` (HMAC verificato)
- **OVH**: VPS + backup giornaliero automatico
- **GLS Italia**: integrazione Label Service per etichette spedizione (config in `config/gls.php`, flag `GLS_ENABLED=false` di default). Contratto TEST: 3100 / Sede V1 / Cliente 413084
- **Brevo**: mail transazionali + lista promoter
- **Aruba PEC**: ricezione passiva fatture passive (NO emissione SDI)
- **Sentry**: NON installato

## Fiscalità (parte del piano compensi)

- **Soglia attività occasionale**: €5.000 netti/anno (€6.410,26 lordi). Sotto: solo IRPEF 17,94% (a titolo d'imposta).
- **Aliquote INPS Gestione Separata IVD** (confermate dal commercialista, Circ. INPS 8/2026):
  - Standard 33,72% (33% IVS + 0,72% assistenziali, NO DIS-COLL)
  - Ridotta 24% (pensionati / iscritti altra gestione)
- **Ripartizione INPS**: 1/3 promoter + 2/3 EVEA
- **Marca da bollo**: €2 se provvigione singola > €77,47 (occasionale)
- Codice fiscale del calcolo: `app/Services/FiscaleService.php`

## Piano compensi MLM

Bonus principali (vedi tabelle nel codice e nel DB):
- **Fast Start Bonus**: one-shot all'iscrizione (Bronze €15, Silver €30, Gold €60, Founder €50)
- **Founder FSB**: €50 al sponsor di un nuovo Founder. Gestito da `FounderPackService::createFsbCommission`, NON dalla pipeline generica (`fastStartBonus` skippa Founder Pack per evitare doppio FSB).
- **Direct Sales (DSB)**: % sulle PV clienti diretti (15% default, 30% se starter kit)
- **Indirect Sales (ISB)**: 4%/3%/3% su 3 livelli
- **Residual** (smartship), **Leadership** (rank 5+), **Residual Matching**, **MVP**, **Rock Solid MVP**, **3 For Free**, **ROB**
- Bonus rank: **Ritual** (one-shot) + **Evolving** (riconoscimento permanente)

Soglia di attività mensile promoter: **50 PQV personali** (su praticamente tutti i bonus mensili).

## Rank system

Tre piani per stesso utente:
- **current**: rank del mese in corso (si azzera ogni mese)
- **recognition**: rank cristallizzato in `rank_history`
- **achievement**: rank massimo storico (mai abbassato)

Cron `commission:auto-approve` (15gg dopo creazione) rilascia commission pending → yes.

## Memoria delle decisioni operative (estratto, server-side dal fisso)

Queste sono le decisioni e i fix accumulati in sessioni precedenti, ricordate qui per essere portabili tra macchine:

- **Reset DB pre-lancio (5/6/2026)**: dopo reset, il pool dei vacant in `tree_sponsor_plan` / `tree_binary_plan` / `tree_matrix_plan` / `tree_monoline_plan` NON viene re-seedato → primo signup post-reset crashava. Hardening guard aggiunto in `SponsorTreeTable::treeAssign` e `TreeTable::treeAssign` per creare vacant on-demand.
- **Invariante promoter vs super_admin**: un promoter NON deve mai avere `is_super_admin=1` o `is_sub_admin=1`. Rompe tutte le route `/api/user/*` con "Unauthorized.".
- **Bank columns legacy vs JSON**: ogni save IBAN deve popolare ANCHE le 5 colonne piatte `iban/swift/bank_name/bank_country/account_holder`, non solo il JSON `bank_account_details`. Pattern già fixato in `OnboardingController::saveBank` e `updateBankIban`.
- **Direct sales naming**: il campo DB `min_pqv_previous_month` controlla in realtà il **mese CORRENTE**, non il precedente. Naming legacy non rinominato per evitare rischi pre-lancio.
- **Slot vacant nei conteggi del tree**: TUTTE le query che fanno `WHERE sponsor = X` su `tree_sponsor_plan` devono aggiungere `where('type', 'yes')->whereNotNull('user_id')`, altrimenti contano gli slot vuoti come reclutamenti reali. Fix applicato in DashboardController (`teamDetails`, `getDownlineIds`, `stats`, `myTopProducts`) e KpiController (`topRecruiters`).
- **deleted_at sui filtri commission**: il model `Commission` NON usa il trait SoftDeletes — `whereNull('deleted_at')` va aggiunto a mano dove serve filtrare le soft-deleted. Bug già riscontrato sul widget Fast Start.
- **FSB Founder doppia commission**: due pipeline indipendenti (`FounderPackService::createFsbCommission` con `payment_type=founder_fsb` + `CommissionRepository::fastStartBonus` generico con `payment_type=fast_start_bonus`) generavano entrambe €50 sullo stesso sponsor a ogni acquisto Founder. Fix: skip in `fastStartBonus` quando il prodotto ha `is_founder_pack=1`.
- **Retro-attivazione Founder**: lucone (id 1328, #1), riccardocampagnari (id 1329, #2) e misterricky/Riccardo Aloisi (id 1333, #5) sono stati promossi a Founder retroattivamente via SQL ad-hoc (NON esiste comando artisan). Marker: `cart.wp_order_id < 0` (es. -5, -6, -7) identifica le retro-attivazioni — utile escluderle dai conteggi di "vendita del team" (solo sul proprio cart). Footprint per attivazione: (1) `users` → `is_founder=1`, `founder_number` progressivo, `founder_joined_at`, `package_id` resta 0; (2) `cart` → riga Founder Pack (`product_id=13`, €1000, `qualification_value=0`, `wp_order_id` negativo, `finished`); (3) `commission` → `founder_fsb` €50 `pending` allo sponsor diretto (`from_id`=nuovo founder, `order_id=[neg]`, note "Fast Start Bonus (Founder Pack) recruitment"). NON tocca `user_payments`/`user_purchases`/`point_table`.
- **Promoter Kit Evea (€79)**: l'iscrizione standard promoter su Shopify. NON va contato come "vendita" nei top products / ticker (è un kit di setup, non un prodotto rivendibile). Filtro: `store_products.is_starter_package = 1`.
- **Co-intestatario**: campi opzionali `co_holder_first_name/last_name/date_of_birth` su `user_profile`, raccolti in onboarding step Personali e profile edit. Solo informativi sulla lettera di incarico, niente impatto fiscale (CF/PIVA restano del titolare).
- **GLS Label Service**: integrazione completata, flag `GLS_ENABLED=false` di default. Comando di test: `php artisan gls:test-label <wp_order_id> [--dry-run]`. Test su contratto 3100 → NumeroSpedizione + PDF A6 ricevuti. Bug pre-esistente: `now()` helper Lumen e `url()` helper Lumen non funzionano in CLI — usare `\Carbon\Carbon::now()` e `config('app.url')`.
- **GLS: lanciare il comando come `forge`, non come `ubuntu`/root**: `sudo -u forge php artisan gls:test-label <wp_order_id>`. Se lanciato come `ubuntu` il comando crasha sul log Lumen (`storage/logs/*.log` sono `forge:forge`, `ubuntu` non è nel gruppo). Se lanciato come root crea `storage/app/gls` di `root:root 700`, che poi blocca il salvataggio etichette anche al processo web. La cartella `storage/app/gls` deve restare `forge:forge`. Riverificato il 14/6/2026: GLS test risponde OK (NumeroSpedizione 661720180, PDF salvato).
- **Gate sponsor al signup (14/6/2026)**: il flusso iscrizione promoter (Shopify checkout) risolveva lo sponsor accettandolo SOLO se `onboarding_status === 'active'` (= aveva firmato la Lettera di Incarico); altrimenti faceva ricadere il reclutato sotto `mlmadmin` (root, id 1) **silenziosamente**. Risultato: chi si iscriveva dal link di un promoter non ancora "active" perdeva lo sponsor reale. Fix (commit `e303362d` su evea-backend): condizione cambiata in `is_promoter===1 && active===1`, in DUE punti — `WordpressController::userRegister` (pre-checkout) e `WordpressRepository` (finalizzazione ordine Shopify, ex riga ~2551). Caso reale corretto: Davide Gazzato (HealthyCoffee, 1334) iscritto da Riccardo Aloisi (misterricky, 1333, allora `pending`) era finito sotto root → rimesso sotto 1333 via SQL.
- **Spostare un nodo nello sponsor tree (manuale, no endpoint)**: NON esiste funzione admin di "move". Si fa in SQL su `tree_sponsor_plan`: aggiornare `sponsor` (campo PRIMARIO, usato live da tutto il motore provvigioni/rank via risalita ricorsiva), `placement_id` (legacy, per coerenza), e riscrivere il `team` path materializzato del nodo E di TUTTI i suoi discendenti (prefisso). Il `team` serve solo a visualizzazione genealogia e autorizzazioni (`LIKE`), non ai soldi. Lo spostamento NON rigenera notifiche (la `NewTeamMemberEmailJob` parte solo al signup vero, ed è soppressa se lo sponsor è super_admin). Sempre `mysqldump` della tabella prima (in `~/tree_backups/` sul VPS).
- **Cron `users:sync-flags` race al signup (15/6/2026)**: il comando gira `everyMinute` e declassava `is_promoter` 1->0 se non trovava un `user_payment` con `payment_status='finished' AND effective_until>=oggi`. Al signup lo status `finished` viene impostato un attimo dopo la creazione del `user_payment`, quindi una finalizzazione a cavallo del minuto faceva declassare il neo-promoter a cliente in modo PERMANENTE (il comando declassa soltanto, non ri-promuove mai). Caso reale: raffaella.ieraci (1335) declassata 1s dopo il signup pur con pagamento valido fino al 2027. Fix (commit `4445a497`): il check "attivo" usa solo il piu recente `effective_until>=oggi`, senza filtrare `payment_status` (come dice la descrizione del comando). Per ripristinare una vittima: `is_promoter=1, is_customer=0` (onboarding_status resta com'e').
- **File backend `root:root` bloccano i save del web**: capita che un file editato come root in sessioni SSH precedenti resti `root:root` (es. `app/Repositories/WordpressRepository.php` trovato così il 14/6). Il web (`forge`) lo legge ma non lo riscrive, e i prossimi edit via `sudo -u forge cp` falliscono con Permission denied. Dopo aver copiato come root, rimettere sempre `sudo chown forge:forge <file>`.
- **Rimborso parziale Shopify — Fase A fatta (commit `e5c43b64`, 27/6/2026)**: il blocco `incomingStatus==='partially_refunded'` in `WordpressRepository::changeOrderStatus` (~`:1362-1500`) ora chiude il vettore di abuso "ordino grande → MVP → rimborso parziale → tengo qualifica". Decisioni di business cementate: **D1** base proporzionamento=BV (fallback price se BV=0); **D3** PointTable decremento proporzionale al DELTA del singolo webhook (idempotente, `currentRefund/originalPrice` non `cumulativeRefund/originalPrice`); **D4** status binario (cart→`partially_refunded`, ordine esce dai gate `finished` anche per rimborsi piccoli — pattern MLM standard). 3 helper privati introdotti in fondo al file: `applyPointTableReversal`, `scaleEvFor3ffForOrder`, `revalidateAfterRefund`. **D2 (Fase B) APERTA**: oggi i bonus MVP/PMB continuano ad essere SCALATI per `adjustmentFactor`; andrebbero invece ri-verificati con i volumi aggiornati e cancellati (`payment_status='cancelled'` + storno saldo) se la qualifica non regge più. Implementazione richiede estrarre `isGoMvpQualified`/`isRockSolidQualified` come metodi puri da `CommissionRepository::goMvpBonus` (~`:513-803`) e `rockSolidMvpBonus` (~`:805-1000`), ~250 righe di refactor: rinviata perché non c'è `office_test` funzionante per validare scenari (qualifica regge → MVP invariato vs non regge → cancellato). TODO esplicito nel codice. Drift logico totale/parziale: il rimborso totale (~`:1496-1900`) NON è stato rifattorizzato per usare i 3 helper — accettato come tech debt risolvibile in PR di consolidamento successiva.
- **Staging frontend `staging.backoffice.myevea.com` (no staging backend)**: è solo il React backoffice; punta sempre ad `api.myevea.com` prod. NON aiuta per testare modifiche backend (refund webhook, calcolo commissioni, ecc.) — quelle vanno testate o via `office_test` (DB di test da setuppare) o in dry-run su prod. Per refactor visuali (MUI, layout, traduzioni) staging è perfetto e zero-rischio.

## Pattern di lavoro

- **Conferma prima di azioni irreversibili**: deploy in produzione, push, modifiche DB su record reali. Per refactor di lettura/codice: procedi diretto.
- **Backup pre-modifica**: ogni modifica sul VPS deve creare un `<file>.bak.<motivo>.<YYYYMMDD_HHMMSS>` prima.
- **Patch backend via SSH + commit/push GitHub a fine sessione**: le modifiche live arrivano sul VPS prima, GitHub si aggiorna alla fine per stare allineato.
- **Niente emoji nel codice o nei file** salvo richiesta esplicita.
- **Niente commenti banali nel codice** — solo dove il "perché" non è ovvio.
- **Niente file di pianificazione/analisi** salvo richiesta esplicita.

## Tools a disposizione di Claude in questo progetto

- `Bash` con accesso SSH al VPS (chiavi in `~/.ssh/`)
- Edit/Read/Write sui due repo
- Mysql via SSH al VPS (credenziali nel `.env` su `/home/forge/api.myevea.com/.env`)

## Quando chiedi a Claude su questo progetto

1. **Prima leggi questo file** (Claude lo fa automaticamente)
2. Per riferimento storico fine-granular, le sessioni di chat passate stanno in `~/.claude/projects/c--Users-matti-Desktop-evea-backoffice-clean/*.jsonl` (sincronizzate via Dropbox tra le macchine di Mattia)
3. Per il codice live, è sempre il VPS che fa testo (`api.myevea.com`)

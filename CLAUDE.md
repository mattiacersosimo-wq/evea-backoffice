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

## Compliance L. 173/2005 — Notifiche Questura

Elenco degli incaricati alla vendita a domicilio va comunicato periodicamente alla Questura territoriale (per EVEA: Verona). Portale: https://webserver.polizia.stato.it/UpubAgentiRappresentanti/ (VERONA 735).

**Tracciamento in DB**: colonna `users.questura_notified_at` (datetime nullable, migration `2026_07_07_140000_add_questura_notified_at_to_users`). NULL = mai comunicato, valorizzato = già notificato in quella data.

**Query utile per prossimo invio**:
```sql
SELECT u.id, u.username, up.first_name, up.last_name, u.promoter_at
FROM users u JOIN user_profile up ON u.id = up.user_id
WHERE u.is_promoter = 1 AND u.lettera_accettata = 1 AND u.questura_notified_at IS NULL
ORDER BY u.promoter_at;
```

**Storia invii**:
- **07/07/2026**: primo invio di **23 promoter** con lettera d'incarico firmata (ids: 1326, 1327, 1328, 1329, 1330, 1331, 1332, 1333, 1334, 1335, 1336, 1338, 1342, 1343, 1345, 1347, 1348, 1349, 1370, 1371, 1375, 1376, 1377). Backup CSV su VPS in `~/backups/questura_notifiche_20260707.csv`. Fatto contestualmente al fix del CSV admin export (commit `d56f646e`) che pescava erroneamente `user_profile.city` (residenza) invece di `user_profile.birthplace` come Comune Nascita.

**Endpoint admin per generare CSV**: `GET /api/wp/compliance/export-questura?from=YYYY-MM-DD&to=YYYY-MM-DD` — file `app/Http/Controllers/Admin/ComplianceController.php::exportQuestura`. Colonne CSV: Nome, Cognome, Data Nascita, Comune Nascita, Provincia Nascita, Codice Fiscale, Indirizzo Residenza, CAP Residenza, Comune Residenza, Provincia Residenza, N. Tesserino, Data Incarico.

## Provider esterni

- **Shopify**: storefront + checkout + webhook ordini → `/api/wp/shopify-checkout` (HMAC verificato)
- **OVH**: VPS + backup giornaliero automatico
- **GLS Italia**: integrazione Label Service per etichette spedizione (config in `config/gls.php`, flag `GLS_ENABLED=false` di default). Contratto TEST: 3100 / Sede V1 / Cliente 413084. Contratto commerciale attivo **V1-00-26-51578** (offerta 29/05/2026, agente Claudia Barchiesi 1151-4O, POT S000223591, Verona 045 8566911). Tariffe rilevanti: Light OOH fino 5kg **€4,30**, Light Nazionale €5,00, Servizio giacenza (10gg deposito) **€7,00**, Riconsegna giacenza €8/100kg, Nulla al Passaggio €5, ZTL €1,65, Peak Season +€0,25 (1/11-15/1), Safety&Energy +€0,20, Sell&Send €0,20/sped. Fuel Surcharge mensile su nolo. Reso al mittente non esplicito nel listino — chiedere a Claudia per conferma se applica riconsegna €8/100kg o nuovo nolo €4,30. Estero: EuroBusinessParcel (Austria €11-13/kg1-10, Germania €11-14, Francia €16-21, UK €18-26 zone 1-2, Spagna €20-25). Assicurazione All-In €5/sped (opz), max €1.500/sped. Pesotassato: rapporto 1:300 (1m3 = 300kg).
- **Brevo**: mail transazionali + lista promoter
- **Aruba PEC**: ricezione passiva fatture passive (NO emissione SDI)
- **Sentry**: NON installato

## Dati economici (aggiornati luglio 2026)

Numeri di riferimento per analisi margine, pricing, strategia commerciale. Business plan completo in `c:\tmp\evea-business-plan.pdf`.

### Costi prodotto (COGS)

Fornitore cinese FOB Fuzhou, cambio 1 USD ≈ 0,92 EUR:

| Prodotto | FOB | + Aluminum bag | COGS sbarcato IT (+ 10% dazi + 10% IVA + €0,3125/pezzo spedizione internazionale su 8k pz per €2500) |
|---|---|---|---|
| 3 in 1 Mushroom Latte / Mocha (210g) | $3,12 | $1,60 | **€5,56/bag** |
| 4 in 1 Mushroom Black Coffee (75g) | $3,85 | $1,20 | **€5,94/bag** |
| Organic Green Tea + Ganoderma (25 sachets) | $3,70 | $0,50 | **€4,98/box** |

**COGS medio mix bilanciato usato nei calcoli (via marittima)**: **€5,50/busta** (con margine di sicurezza per fluttuazioni cambio).

Plate-making fee one-shot: $620 aluminum bags, $760 sachet tea, $380 hand tag (ammortizzati sui primi lotti).

### Confronto spedizione internazionale marittima vs aerea

| Modalità | Costo 8.000 pz | Costo/pezzo | COGS medio/busta | Tempi consegna |
|---|---|---|---|---|
| **Marittima** (attuale) | €2.500 | €0,3125 | **€5,50** | 30-45 gg |
| **Aerea** | €10.000 | €1,25 | **€6,44** | 5-10 gg |
| **Δ** | +€7.500 | +€0,9375 | +€0,94/busta | -25/35 gg |

Impatto aerea su margine EVEA/anno per cliente:
- Cliente 1 box: da +€15 a **+€4** (praticamente zero, rischio perdita se altri costi salgono)
- Cliente 3 box: da +€326 a +€292 (-10%)
- Cliente 12 box: da +€1.571 a +€1.436 (-9%)
- Aggregato 100 clienti smartship: da €15.796 a €13.551/anno **(-€2.245/anno differenza margine)**

**Quando aerea**: rischio stockout, agilità riordini, test nuovi prodotti, cambi formulazione. **Quando marittima**: volume stabile prevedibile, priorità margine. **Raccomandazione**: default marittima, aerea come "riserva strategica" solo per riordini urgenti best-seller in stockout imminente.

### Logistica magazzino DCA Consulting (Verona, contratto 01/06/2026-31/12/2027, referente Susanne Kusoglu)

**Fissi mensili con 10 palette**:
- Magazzinaggio (fino a 50 plt): €2,50/settimana/plt = ~€108/mese
- Contributo smaltimento rifiuti: €25/mese fisso
- Assicurazione Incendio/Furto (opz): €70/mese
- **Totale fissi**: €133-203/mese = €1.596-2.436/anno

**Variabili per spedizione**:
- Preparazione ordine: €0,15/pezzo, **minimo €2,50/spedizione** (copre 1-16 pezzi)
- Etichetta destinatario: €0,90/etichetta
- Assemblaggio kit: €3/kit
- Scarico merce entrante: €2/palette

**Costo logistica totale per pacco spedito** (assumendo 1.560 pacchi/anno di volume):
- GLS: €4,30 (contratto 1463, sede V1, cliente 413084, tariffa Light fino 5kg Out of Home)
- DCA prep + etichetta: €3,40 (min)
- DCA fissi ammortizzati: €1,56
- **TOTALE: €9,26/pacco standard, €14,46/pacco per 12 box (2 pacchi >5kg)**

### Free shipping cliente

- Contributo cliente: **€7,60/spedizione sotto €97 di ordine**
- **Gratuita sopra €97** (scatta al 4° box smartship: €26,73 × 4 = €106,92)
- Impatto EVEA: -€1,66/pacco netto sotto soglia, -€9,26/pacco sopra (assorbita interamente)

### Commissioni MLM effettive medie

- Direct Sales (DSB): 15% listino (30% starter kit)
- Indirect Sales (ISB): 4%+3%+3% su 3 livelli
- Residual smartship: ~5-8% variabile per rank
- Leadership: solo rank 5+
- Considerando i gate (50 PQV, rank, profondità), **percentuale effettiva pagata da EVEA ~22% del listino netto** = **€5,35/busta** (range realistico 20-25%)
- Piattaforme (Shopify 2% + Seal + Klaviyo): **~€0,50/busta**

### Prezzi listino

- **Prezzo listino busta**: €29,70 lordo IVA (€27,00 netto IVA 10%)
- **Prezzo smartship (-10%)**: €26,73 lordo (€24,30 netto)

### Margine EVEA per profilo cliente smartship (con ROB fisso €30 attuale)

| Profilo | Costo/busta EVEA | Ricavo/busta EVEA | Margine/busta | **Margine/anno cliente** |
|---|---|---|---|---|
| 1 box/mese | €20,61 | €21,90 | +€1,29 | **+€15 (breakeven)** |
| 2 box/mese | €15,86 | €22,25 | +€6,39 | +€153 |
| 3 box/mese | €14,44 | €23,50 | +€9,06 | +€326 |
| 4 box/mese | €13,67 | €22,80 | +€9,13 | +€438 |
| 6 box/mese | €12,89 | €22,63 | +€9,74 | +€701 |
| 12 box/mese | €12,56 | €23,47 | +€10,91 | **+€1.571** |

Aggregato 100 clienti smartship distribuzione realistica (55% 1box, 25% 2box, 12% 3-4box, 6% 5-6box, 2% 12box): **~€15.800/anno margine EVEA**.

### Strategia ROB Proporzionale (formula finale scelta — luglio 2026)

**Problema**: listino attuale incoerente — chi compra di più paga di più/busta (1 box=€16,73, 6 box=€25,03). Nessun incentivo upgrade + apre vettore stuffing.

**Formula scelta**: `coupon_ROB = min(€60, max(€26,73, 0.667 × subtotale_mensile_minimo_del_ciclo))`

Il pavimento €26,73 = prezzo di una busta smartship = **il cliente 1 box riceve effettivamente 1 busta gratis ogni 3 mesi**. Comunicazione commerciale forte per tutti i profili.

**Prezzi/busta risultanti**:
- 1 box → €17,82 (era €16,73, +€1,09 = +6,5% appena percettibile)
- 2 box → €20,79 (era €21,73, -€0,94)
- 3 box → €20,79 (era €23,40, -€2,61)
- 4 box → €21,73 (era €24,23, -€2,50)
- 6 box → €23,40 (era €25,03, -€1,63)
- 12 box → €25,06 (era €26,00, -€0,94)

**Bilancio economico su 100 clienti smartship**:
- Costo extra EVEA base: **-€2.093/anno**
- Recupero anti-stuffing (15% stuffer): +€5.490
- Retention high-volume: +€2.500
- Effetto upgrade 1→2-3 box: +€600
- **Guadagno netto atteso: +€6.497/anno su 100 clienti**

**Perché il pavimento €26,73 e non €30 (attuale) o €0 (senza pavimento)**:
- vs €30: cliente 1 box passa da €16,73 a €17,82/busta (+€1,09), risparmio EVEA €715/anno
- vs €0 (senza pav): cliente 1 box paga solo €17,82 invece di €20,79 (evita shock -33%)
- **Zero rischio politico sui clienti 1 box esistenti**, nessun grandfathering necessario
- Comunicazione chiara: "1 busta gratis ogni 3 mesi" per tutti

**Implementazione tecnica — DEPLOYATA 04/07/2026** (commit backend `ad8b79c3`+`8916f6fe`, frontend `39af2c6`):
- Migration `2026_07_04_120000_add_proportional_formula_to_recurring_order_bonus_settings`: 4 colonne (`formula_coefficient` default 0.6667, `formula_cap` 60.00, `formula_floor` 26.73, `use_proportional_formula` default **false**)
- `WordpressRepository::consecutivePurchaseCoupon` esteso: raccolta subtotali pre-coupon nel loop consecutività + calcolo `min(cap, max(floor, coefficient × subtotale_min_ciclo))` gated dal switch, altrimenti fallback €30 fisso
- Base pre-coupon (anti-ricorsione T-G6): `cart.price + max(0, discount_amount - consecutive_discount_amount)`. Riaggiunge la porzione coupon (ROB/3FF) al prezzo netto, NON lo sconto SmartShip -10%. Senza questo, ogni ciclo con riscatto ROB precedente farebbe oscillare il coupon successivo
- Admin UI: sezione "ROB Proporzionale (formula)" con switch + 3 input (`coefficient`, `cap`, `floor`), campi disabilitati quando switch OFF
- Test `tests/rob_proportional_test.php`: T-G1..T-G8 tutti verdi su `office_test` (T-G6 è la guardia anti-ricorsione)
- **Cap 3FF applicato**: `three_for_free_settings.max_bonus_value` 90 → 80 il 04/07/2026 (backup pre-modifica in `~/backups/three_for_free_settings.pre-cap-80.*.sql`)
- **Master switch attualmente OFF** (`recurring_order_bonus_settings.use_proportional_formula = 0`): il ROB continua a essere €30 fisso in produzione. Per attivare: `UPDATE recurring_order_bonus_settings SET use_proportional_formula = 1 WHERE is_active = 1` o via admin UI backoffice. Rollback: rimettere il valore a 0.
- V1 (cumulo ROB+3FF): `$stackableTypes = ['3ff_programe', '3ff_residual', 'rob_bonus']` in `app/Rules/ValidCoupon.php:59`. Sommabili sullo stesso ordine fino a max 3 coupon per cart item. Payout aggregato massimo €140+ per ordine se combinati (60 ROB + 80 3FF). Nessun cap complessivo codificato.
- V2 (categoria 'subscription' esclusa dal loop consecutività): esclude solo il Kit Promoter EVEA (€79, category `'subscription'`), NON gli ordini SmartShip che hanno category `'product'`. Comportamento corretto — non è un bug.
- V3 (soglia €97 free shipping): nessun hardcoded backend, tutto lato Shopify. Nessun ricalcolo lato server. **Da verificare manualmente su Shopify Admin** se la soglia valuta subtotale PRE-coupon o POST-coupon (test empirico: carrello €106,92 + coupon ROB → shipping deve restare €0). Se POST-coupon, fix su Shopify shipping profile, non backend.

Documento tecnico completo di implementazione: `c:\tmp\IMPLEMENTAZIONE_ROB_G.md`.
Ricognizione read-only pre-implementazione: `c:\tmp\RICOGNIZIONE_ROB_SPEDIZIONI.md`.

Anti-stuffing gestito con **dashboard alert admin** (no automazione bloccante) — implementazione separata quando pronti (fuori scope variante G).

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
- **GLS PUDO / Shop Delivery — integrazione completata e VERIFICATA SHOP (28/6/2026)**: il flusso PUDO è end-to-end funzionante sul contratto test 3100. Il cliente sceglie il Punto di Ritiro al checkout Shopify tramite il plugin **Qapla' "Punti di Ritiro PUDO"** (gratuito, app store Shopify); Qapla' salva la scelta come metafield ordine `qapla.pudos_info` (namespace=`qapla`, key=`pudos_info`, type=json) con struttura `{id, address1, postCode, city, provinceCode, pickupPoint, PUDO:{type, ...}}`. `GlsService::extractPudoData` chiama l'Admin API Shopify (`GET /admin/api/{version}/orders/{id}/metafields.json` con `SHOPIFY_ADMIN_ACCESS_TOKEN`) per leggere il metafield e mappa: `shop_id`=PUDO.id (es. `635574`), `partner_shop_id`=PUDO.type (es. `PRP_IT`), indirizzo PUDO usato come destinatario, `RagioneSociale` resta del cliente che ritira. Branch SHOP in `createLabelForOrder` aggiunge nel payload AddParcel i tag **`<PARTNER_SHOP_ID>PRP_IT</PARTNER_SHOP_ID>` + `<SHOP_ID>635574</SHOP_ID>`** (nomenclatura corretta da MU162 v30 §5.1.1.3 — il nostro primo test col tag `<ShopID>` singolare era ignorato da GLS che trattava come Nazionale standard). Test SHOP confermato 28/6/2026: ordine 8122408304986 → NumeroSpedizione 661777845 → etichetta PDF A6 generata con **scritta "SHOP" visibile sotto il barcode** + dati PUDO nei campi destinatario + `infusasgl@gmail.com` come riferimento PUDO. Test precedente del 27/6 col tag errato (661777726) era riuscito ma etichetta SENZA marchio SHOP. Decisione di stack: **bypass totale Sell&Send 2.0** (costa €0,20/spedizione) — chiamata SOAP diretta GLS Label Service. Tag commerciale sul contratto: "Out of Home" (vs "Nazionale"), tariffe Light fino 5kg €4,30 OOH vs €5,00 Naz. Domande tecniche residue al referente GLS (Email/Flex/Track&Trace ServiziAccessori codici) sono in stack ma NON bloccano go-live.
- **GLS CloseWorkDay bug fix — trackingRaw senza prefisso V1 (03/07/2026, commit backend `68b3be24`)**: il commit `a635fd41` del 02/07 aveva prefissato con `V1` la variabile `$tracking` in `GlsService::createLabelForOrder` per far funzionare la ricerca sul portale/tracking_url pubblico. Ma il payload SOAP `CloseWorkDayByShipmentNumber` (riga 287) che segue vuole `NumeroSpedizione` **raw senza sigla** (es. `661803617`, non `V1661803617`). Regressione: dal 02/07 20:33 in poi tutti i Close hanno risposto **"Spedizione inesistente o precedentemente cancellata"** → etichette generate ma **spedizioni MAI trasmesse a GLS** (i pacchi al ritiro sarebbero stati rifiutati). Diagnosticato confrontando log storici pre-a635fd41 (tracking `661xxxxxx`, close OK) vs post (tracking `V1661xxxxxx`, close KO). Fix: `<NumeroDiSpedizioneGLSDaConfermare>{$this->xml($trackingRaw)}</NumeroDiSpedizioneGLSDaConfermare>` invece di `$tracking`. Impatto retroattivo: solo Alan Ceruti (ordini 8134735659354 + duplicato 8135630848346) — unico cliente reale nel periodo 02/07 22:36 → 03/07 12:31, gestito manualmente (primo→delivered_by_hand, secondo→etichetta nuova V1661806956 con close OK dopo il fix).
- **GLS webhook Make — scenario UPDATE-only, non INSERT (03/07/2026)**: lo scenario Make "Gls tracking e pudo" (webhook → Google Sheets Search Rows → Google Sheets Update a Row) sa **solo aggiornare** righe esistenti sul foglio Magazzino. Se la riga per il `wp_order_id` non esiste (es. cancellata a mano), Search Rows ritorna vuoto → Update Row fallisce con `BundleValidationError: Missing value of required parameter 'rowNumber'` → scenario si autodisattiva. La riga base sul foglio la crea un ALTRO webhook Shopify→Sheets al momento dell'ordine, poi il webhook GLS la aggiorna con tracking + link etichetta. Se serve popolare a mano: aggiungere riga con almeno `wp_order_id` prima di ri-triggerare il webhook GLS. Ri-trigger manuale: `curl -X POST $MAKE_WEBHOOK_SHIPMENT_URL -H "Content-Type: application/json" -d '{"wp_order_id":"...","tracking_number":"V1...","carrier":"GLS",...}'`. Per silenziare notifiche (mail Susanne + webhook Make) durante debug: svuotare `WAREHOUSE_NOTIFICATION_EMAIL` e `MAKE_WEBHOOK_SHIPMENT_URL` in `.env` (entrambi hanno early-return no-op se vuoti).
- **GLS consolidamento non filtra soft-deleted (03/07/2026, bug NON risolto)**: `GlsService::tryConsolidateWithExistingShipment` (riga 415) cerca cart con stesso `shipping_email + shipping_postcode` con `tracking_number` NOT NULL e `shipped_at` NULL, **senza filtrare `whereNull('deleted_at')`**. Quindi un cart soft-deleted ancora con tracking valorizzato viene ripescato e il nuovo ordine consolidato su quel tracking morto. Workaround durante debug Alan: azzerare tracking sul cart soft-deleted prima di rilanciare `gls:test-label`. Fix definitivo pendente: aggiungere `->whereNull('deleted_at')` alla query di ricerca del match esistente.
- **GLS PUDO — DETECTION DISABILITATA (03/07/2026, commit `1ef7b326`)**: nuovo config flag `gls.pudo_detection_enabled` (env `GLS_PUDO_DETECTION_ENABLED`, default `false`) mette un master switch OFF su `GlsService::extractPudoData()` che ritorna `null` prima ancora di chiamare Shopify. Motivo: il plugin Qapla' scrive il metafield `qapla.pudos_info` anche quando il cliente sceglie "Corriere GLS" al checkout (falsi positivi). Nessun campo Shopify permette di distinguere un PUDO scelto davvero da uno solo esplorato: `shipping_lines[].title` resta `"Corriere Gls"` in entrambi i casi (verificato su 4 ordini reali con metafield PUDO presente), `shipping_address` resta la casa del cliente. Caso reale che ha triggerato il fix: ordine 8134735659354 di Alan Ceruti (Via Galvani 14 A, Verona 37138) — cliente ha scelto Corriere ma il sistema ha creato etichetta al PUDO Pet4You (Via Marin Faliero 69, Verona 37138), 3 spedizioni fantasma su GLS area riservata cancellate a mano da Mattia. Fix rev3 conservato in codice (safeguard PRIMARIO su `fetchOrderShippingMethod()` + safeguard SECONDARIO street-match fuzzy) come guardrail per il futuro, ma senza un segnale attendibile da Qapla' il flag resta OFF. Il 2/7/2026 rimossa anche l'opzione PUDO dagli shipping method Shopify (unico metodo: "Corriere GLS") come cintura+bretelle. Per riattivare in futuro serve: shipping method dedicato in Qapla' (es. "Punto di Ritiro GLS") o note_attribute custom di conferma PUDO al checkout.
- **Gate sponsor al signup (14/6/2026)**: il flusso iscrizione promoter (Shopify checkout) risolveva lo sponsor accettandolo SOLO se `onboarding_status === 'active'` (= aveva firmato la Lettera di Incarico); altrimenti faceva ricadere il reclutato sotto `mlmadmin` (root, id 1) **silenziosamente**. Risultato: chi si iscriveva dal link di un promoter non ancora "active" perdeva lo sponsor reale. Fix (commit `e303362d` su evea-backend): condizione cambiata in `is_promoter===1 && active===1`, in DUE punti — `WordpressController::userRegister` (pre-checkout) e `WordpressRepository` (finalizzazione ordine Shopify, ex riga ~2551). Caso reale corretto: Davide Gazzato (HealthyCoffee, 1334) iscritto da Riccardo Aloisi (misterricky, 1333, allora `pending`) era finito sotto root → rimesso sotto 1333 via SQL.
- **Spostare un nodo nello sponsor tree (manuale, no endpoint)**: NON esiste funzione admin di "move". Si fa in SQL su `tree_sponsor_plan`: aggiornare `sponsor` (campo PRIMARIO, usato live da tutto il motore provvigioni/rank via risalita ricorsiva), `placement_id` (legacy, per coerenza), e riscrivere il `team` path materializzato del nodo E di TUTTI i suoi discendenti (prefisso). Il `team` serve solo a visualizzazione genealogia e autorizzazioni (`LIKE`), non ai soldi. Lo spostamento NON rigenera notifiche (la `NewTeamMemberEmailJob` parte solo al signup vero, ed è soppressa se lo sponsor è super_admin). Sempre `mysqldump` della tabella prima (in `~/tree_backups/` sul VPS).
- **Cron `users:sync-flags` race al signup (15/6/2026)**: il comando gira `everyMinute` e declassava `is_promoter` 1->0 se non trovava un `user_payment` con `payment_status='finished' AND effective_until>=oggi`. Al signup lo status `finished` viene impostato un attimo dopo la creazione del `user_payment`, quindi una finalizzazione a cavallo del minuto faceva declassare il neo-promoter a cliente in modo PERMANENTE (il comando declassa soltanto, non ri-promuove mai). Caso reale: raffaella.ieraci (1335) declassata 1s dopo il signup pur con pagamento valido fino al 2027. Fix (commit `4445a497`): il check "attivo" usa solo il piu recente `effective_until>=oggi`, senza filtrare `payment_status` (come dice la descrizione del comando). Per ripristinare una vittima: `is_promoter=1, is_customer=0` (onboarding_status resta com'e').
- **File backend `root:root` bloccano i save del web**: capita che un file editato come root in sessioni SSH precedenti resti `root:root` (es. `app/Repositories/WordpressRepository.php` trovato così il 14/6). Il web (`forge`) lo legge ma non lo riscrive, e i prossimi edit via `sudo -u forge cp` falliscono con Permission denied. Dopo aver copiato come root, rimettere sempre `sudo chown forge:forge <file>`.
- **Rimborso parziale Shopify — Fase A+B fatte (commit `e5c43b64`+`d013fd35`, 27/6/2026)**: il blocco `incomingStatus==='partially_refunded'` in `WordpressRepository::changeOrderStatus` (~`:1362-1530`) ora chiude il vettore di abuso "ordino grande → MVP → rimborso parziale → tengo qualifica" e applica tutte e 4 le decisioni del piano. **D1** base proporzionamento=BV (fallback price se BV=0); **D3** PointTable decremento proporzionale al DELTA del singolo webhook (idempotente, `currentRefund/originalPrice` non `cumulativeRefund/originalPrice`); **D4** status binario (cart→`partially_refunded`, ordine esce dai gate `finished` anche per rimborsi piccoli — pattern MLM standard); **D2** bonus flat MVP/PMB ri-verificati: o reggono i gate (invariati, no scaling) o non reggono (`payment_status='cancelled'` + storno saldo + cancellazione `pmb_bonus` legati). 5 helper privati introdotti in fondo a `WordpressRepository`: `applyPointTableReversal`, `scaleEvFor3ffForOrder`, `revalidateAfterRefund`, `revalidateMvpQualification`, `cancelMvpCommissionWithLinkedPmb`. 2 metodi pubblici nuovi in `CommissionRepository`: `isGoMvpQualified(int, ?Carbon): bool` e `isRockSolidQualified(int, ?Carbon): bool` (replicano i gate puri, usano il pool ATTUALE di clienti — non il `persistedCustomerIds` della note del previous bonus — perché il check "regge oggi?" deve guardare lo stato attuale). **Drift logico totale/parziale CHIUSO** (commit `8d4cd1fa`): il rimborso totale ora chiama gli stessi 3 helper (`applyPointTableReversal($orderId, 1.0)`, `scaleEvFor3ffForOrder($orderId, 0)`, `revalidateAfterRefund($users, $date, 'refund_full')`), eliminando ~50 righe duplicate inline. Sicurezza migliorata: Artisan::call NON gira più dentro la transaction aperta. **Drift gate MVP — duplicazione ACCETTATA E DOCUMENTATA** (commit `8bbf485f`, 27/6/2026): tentativo di consolidamento abortito dopo diff semantico. `goMvpBonus`/`rockSolidMvpBonus` e `isGoMvpQualified`/`isRockSolidQualified` NON sono semanticamente equivalenti — la differenza principale è INTENZIONALE: `goMvpBonus` include `$persistedCustomerIds` dalla note del previous bonus (fidelizzazione qualifica), `isGoMvpQualified` usa solo `$currentCustomerIds` (regge oggi?). Sostituire alla cieca farebbe smettere di pagare bonus legittimi a promoter con clienti diventati promoter nel frattempo. Per consolidare in futuro serve: (1) decisione di policy su "qualifica = stato oggi" vs "qualifica = stato al momento di creazione", (2) E2E test in `office_test` che blocchino il comportamento attuale di entrambi i cron PRIMA del refactor. Senza, lasciare separati. Vedi docblock dettagliata sopra `isGoMvpQualified` in `CommissionRepository.php`. Test fatti: smoke su 7 utenti in `office_test` (clone DB prod), zero crash. Scenari E2E (T1-T4) rinviati: richiedono fixture seeding (~45min ciascuno).
- **office_test (DB clone)**: creato il 27/6/2026 come clone strutturale+dati di `office_db` per testare logiche backend senza toccare prod. Path `.env.testing` su VPS: `/home/forge/api.myevea.com/current/.env.testing` (uguale a `.env` ma `DB_DATABASE=office_test`). Per lanciare uno script PHP contro office_test: `DB_DATABASE=office_test php /path/to/script.php`. Backup mysqldump pre-Fase-B: `~/backups/office_db.pre-phase-b.20260627_074407.sql.gz`. Per refresh: `gunzip -c BACKUP | mysql -uforge -p... office_test`.
- **Staging frontend `staging.backoffice.myevea.com` (no staging backend)**: è solo il React backoffice; punta sempre ad `api.myevea.com` prod. NON aiuta per testare modifiche backend (refund webhook, calcolo commissioni, ecc.) — quelle vanno testate o via `office_test` (DB di test da setuppare) o in dry-run su prod. Per refactor visuali (MUI, layout, traduzioni) staging è perfetto e zero-rischio.
- **GLS consolidamento — finestra 24h e webhook Apps Script FUNZIONANTE (11/07/2026)**: caso Tetyana Kolesnikova (ordini 8162248065370 + 8165857591642) inizialmente diagnosticato come "webhook Google Sheets → backend rotto". Diagnosi ERRATA: il webhook `onEditWarehouse` funziona correttamente. Verificato via DB — tutti gli ordini flaggati SPEDITO sul foglio hanno `cart.shipped_at` valorizzato con timestamp che matchano al secondo le esecuzioni Apps Script (es. 8162339979610 shipped_at=2026-07-10 15:59:22 ↔ esecuzione onEditWarehouse Jul 10 15:59:22). Non si vede nei log perché (1) nginx `access_log off;` sul config Forge di api.myevea.com, (2) `Admin/GlsController::markShipped` non logga i successi (solo errori). Il **vero gap** era temporale: Susanne clicca SPEDITO ore/giorni dopo aver fisicamente consegnato i pacchi a GLS. Cart 79 (Tetyana #1) aveva label generata 09/07 16:32 ma SPEDITO cliccato solo 11/07 12:38 → tra l'11/07 10:07 AGGIUNGI email è partita perché `shipped_at IS NULL` era ancora vero. Fix (`GlsService::tryConsolidateWithExistingShipment`): finestra 48h → **24h**. Se una label è vecchia >24h ed è ancora unshipped nel DB, il codice assume che sia già partita fisicamente. Trade-off: qualche consolidamento inter-day legittimo raro potrebbe mancare. Nessuna modifica su Apps Script o Google Sheets — funzionano.
- **INCIDENTE cancellazione massiva utenti (23/08/2026) — risolto**: uno script che doveva cancellare i 2 account duplicati di Marco Parrella (id 1454, 1460) da 6 tabelle ha usato la **condizione WHERE invertita** (`NOT IN` invece di `IN`), cancellando tutti gli **altri 106 utenti** — `mlmadmin` (id 1) compreso. Sintomo riportato: "gli utenti non esistono più, non si accede a backoffice e community". Non era il login: gli utenti non c'erano. Firma diagnostica inequivocabile: gli unici superstiti preesistenti erano proprio 1454 e 1460, cioè i due che dovevano sparire. Tabelle colpite (le 6 per cui esistevano i backup `pre_delete_marco_parrella_*`): `users`, `user_profile`, `activity_logs`, `community_badges_earned`, `guest_magic_links`, `community_notifications`. **Intatte**: `cart`, `commission`, `tree_sponsor_plan`, `user_payments`, `community_posts`. Non era un `DROP` né un `migrate:refresh` — `AUTO_INCREMENT` restato a 1481 indica righe cancellate una a una. **Recupero**: backup automatico OVH del 23/08 ore **14:01 UTC** (= 16:01 italiane), 90 minuti prima del `DELETE` delle 15:31 UTC. Montato via pannello OVH come **disco aggiuntivo `/dev/sdb`** (non NFS, nonostante il popup dica "NFS o SMB"), montato `ro`, copiato il datadir e avviata una **seconda istanza mysqld su porta 3307** con eccezione AppArmor temporanea (il profilo `/usr/sbin/mysqld` è in enforce e blocca datadir fuori da `/var/lib/mysql`). Trasferimento con `mysqldump --no-create-info --complete-insert --insert-ignore` dalle 6 tabelle: la produzione **non si è mai fermata** e i dati creati dopo il backup (2 ospiti, 3 magic link) sono stati preservati. Esito: 110 utenti, zero orfani. Backup completi conservati fuori dal VPS in `Desktop/evea-incidente-20260823/`. **Nota sul fuso**: il VPS è `Etc/UTC` mentre l'app scrive i timestamp in ora italiana (UTC+2) — confrontare orari DB e filesystem senza tenerne conto porta a conclusioni sbagliate sulla sequenza degli eventi.
- **Dump con stderr dentro il file = backup inutilizzabile**: `pre_demo_review_20260818_100626.sql` aveva come **prima riga** `mysqldump: [Warning] Using a password on the command line interface can be insecure.`, finita nel file per un `2>&1` di troppo. Non essendo SQL valido, `mysql < file` si ferma alla riga 1 e non importa **nulla**, in silenzio. Il backup sembrava buono ed era inservibile. Workaround per i dump già esistenti: `tail -n +2 file.sql | mysql ...`.
- **Ospite bloccato su "diventa distributore" — `validateUser` non guest-aware (24/08/2026)**: Marco Parrella, iscritto due volte dalla landing opportunità come ospite (id 1454 `marco.parrella2085@gmail.com` sponsor `evea`, id 1460 `marcoparrella1985@gmail.com` sponsor `Mike11`), vedeva "email già registrata" e non poteva diventare promoter. **Non era un problema di dati**: `WordpressController::registerPromoter` gestisce già il caso — trova l'utente con `is_guest=1`, ne eredita `sponsor_code` e `marketing_consent`, lo cancella e procede (gate `GUEST_ROLE_ENABLED`, che è `true`). Ma il pre-check che il tema Shopify chiama prima, `validateUser`, faceva `User::where('email',...)->exists()` **senza escludere gli ospiti**, bloccando l'utente prima che arrivasse alla registrazione. Fix: stesso gate su `validateUser` e `validateUsername`, con `unique:users,email,NULL,id,is_guest,0` nelle regole e `->when($guestAware, fn($q) => $q->where('is_guest', 0))` sui check espliciti. **Nota importante**: cancellare l'ospite a mano (soluzione istintiva, ed è quella che ha causato l'incidente del 23/08) fa **perdere l'eredità dello `sponsor_code`** — il promoter si ritrova senza sponsor e va risistemato a mano sull'albero. Il messaggio in italiano che vede l'utente arriva dal tema Shopify; il backend risponde in inglese (`The email has already been taken.`) — utile per capire da quale strato arriva un errore.
- **`validateSponsor` cancellata per errore da una patch (24/08/2026)**: sostituendo `validateUser` e `validateUsername` con un intervallo di righe si è portata via anche `validateSponsor`, che stava in mezzo fra `validateUsername` e `userSponsor`. È la funzione dietro `GET /api/validate-sponsor/{referral}`, cioè il campo "chi ti ha parlato di EVEA?" sul banner di myevea.com: per ~13 ore nessun username veniva trovato. Sintomo fuorviante — sembrava una conseguenza dell'incidente del giorno prima. Verifica rapida quando un endpoint smette di rispondere: `grep -c "function <nome>"` sul file attuale **e** sul `.bak` più recente.

## Backup e sicurezza dati (dal 23/08/2026)

Infrastruttura installata dopo l'incidente di cancellazione massiva. Prima di quella data non esisteva **nessun** backup automatico del database sul VPS e il binlog era disattivato: l'unica rete era lo snapshot OVH giornaliero.

- **Binary log ATTIVO**: `skip-log-bin` era in `/etc/mysql/my.cnf`, posizionato **dopo** gli `!includedir` — quindi sovrascriveva qualsiasi impostazione messa in `conf.d/`. Va disattivato lì, non altrove. Config attuale: `log_bin=/var/log/mysql/mysql-bin`, `binlog_format=ROW`, **`binlog_row_image=FULL`** (registra tutti i valori delle colonne, quindi le righe cancellate sono ricostruibili), `sync_binlog=1`, retention 30 giorni. Per recuperare righe da un `DELETE`: `sudo mysqlbinlog --base64-output=DECODE-ROWS -v /var/log/mysql/mysql-bin.NNNNNN`.
- **Backup giornaliero**: `/usr/local/bin/evea-db-backup.sh`, cron `/etc/cron.d/evea-db-backup` alle **02:30**, output in `/var/backups/mysql` (14 giornalieri + 8 settimanali). Credenziali in `/etc/mysql/evea-backup.cnf` (`600 root:root`), mai sulla riga di comando. Lo script fallisce apposta se il dump è corrotto, se `gzip -t` non passa, o se non contiene righe di `users` — un archivio valido ma vuoto è il fallimento più insidioso. Log in `/var/log/evea-db-backup.log`.
- **Cancellazione guidata**: `sudo /usr/local/bin/evea-safe-delete.sh <tabella> "<where>" <righe_attese>`. Va dichiarato in anticipo quante righe ci si aspetta di colpire; se il conteggio non corrisponde **non cancella nulla**. Rifiuta `WHERE` vuote o tautologiche, mostra un'anteprima, richiede di scrivere `ELIMINA`, salva le righe in `/var/backups/mysql/pre-delete/` prima di procedere e stampa il comando per annullare. **Usare sempre questo al posto di un `DELETE` a mano su tabelle di produzione.**
- **Regola generale**: prima di ogni `DELETE`, eseguire la stessa `WHERE` come `SELECT COUNT(*)` e confrontarla con il numero atteso. Il 23/08 avrebbe restituito 106 invece di 2.

## Pattern di lavoro

- **Conferma prima di azioni irreversibili**: deploy in produzione, push, modifiche DB su record reali. Per refactor di lettura/codice: procedi diretto.
- **Backup pre-modifica**: ogni modifica sul VPS deve creare un `<file>.bak.<motivo>.<YYYYMMDD_HHMMSS>` prima.
- **Dopo una patch, `diff` contro il backup — sempre, prima di dire "fatto"**: controllare la sintassi (`php -l`) e testare la funzione toccata **non basta**. Il 24/08 una patch su `WordpressController.php` ha cancellato `validateSponsor`, che era sintatticamente irrilevante e in un'altra parte del file: entrambi i controlli erano verdi e l'endpoint del banner sponsor è rimasto rotto 13 ore. Il controllo che lo avrebbe visto subito: `diff $F.bak.<motivo>.<ts> $F` e, su file grandi, `diff <(grep -oE "^    public function [a-zA-Z]+" $BAK | sort) <(... $F | sort)` per confermare che non manchi nessuna funzione. Vale in generale: **verificare ciò che si è cambiato non dice nulla su ciò che si è rotto altrove**.
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

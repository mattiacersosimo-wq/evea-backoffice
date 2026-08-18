# EVA — Piano Contenuti Knowledge Base v1.0

**Data:** 30/07/2026 · Agente live · Beta Founder: agosto · Lancio pubblico: 1 settembre 2026
**Scopo:** mappa di ciò che EVA deve saper coprire, con linea di risposta per area, inventario di cosa darle in pasto (esistente vs da scrivere) e ciclo di aggiornamento.

---

## 1. Principio guida

EVA risponde bene se ogni risposta ha una **fonte**: un dato dal DB (via tool) o un chunk di KB. Tutto ciò che non è coperto da una delle due → escalation. Quindi la domanda "a cosa deve rispondere" equivale a "per cosa le abbiamo dato una fonte". Questo documento è l'elenco delle fonti da garantire.

---

## 2. Tassonomia — PROSPECT e CLIENTI PRE-ACQUISTO

Il pubblico più numeroso da settembre. Qui si gioca la conversione.

| Area | Domande tipo | Linea di risposta | Fonte |
|---|---|---|---|
| Prodotti base | Cosa sono? Differenze Black/Mocha/Latte/Green Tea? Che gusto hanno? Si sente il fungo? | Descrizione gusto ed esperienza, profili dei 4 SKU, rituale. Mai benefici. "Si sente il fungo?" → no, il profilo è quello di un ottimo caffè/tè (descrizione sensoriale) | Schede prodotto KB **(da scrivere)** |
| Dati etichetta | Quanta caffeina? Ingredienti? Allergeni? Vegan? Gluten-free? Valori nutrizionali? Quante porzioni? | Dati esatti di etichetta, riportati come pura informazione. È l'unica area "tecnica" senza rischio claim — deve essere impeccabile | Schede etichetta **(da scrivere — PRIORITÀ 1)** |
| Preparazione e conservazione | Come si prepara? Acqua o latte? Caldo/freddo? Quanto dura aperto? Come si conserva? | Istruzioni pratiche passo-passo | Schede prodotto + dati HACCP **(da adattare)** |
| Funghi e qualità | Che funghi usate? Da dove vengono? Corpo fruttifero o micelio? Certificazioni? | Storytelling filiera: GanoHerb dal 1989, Fujian, 100% corpo fruttifero, doppia estrazione, tradizione millenaria (Reishi "conosciuto come" fungo dell'immortalità — solo contesto storico). Percentuali COA **solo ai promoter** | Scheda filiera **(da scrivere)** |
| Salute | Fa bene a…? Posso berlo se sono incinta/prendo farmaci/ho X? | Sempre e solo: parlane con il tuo medico (+ dati etichetta come informazione neutra) | System prompt (già coperto) |
| Prezzi e acquisto | Quanto costa? Spedizione? Tempi? Pagamenti? Sconti? | Prezzi correnti, spedizione gratis da €97, 2–5 gg lavorativi, pagamenti accettati. Unico "sconto" nominabile: −10% SmartShip + coupon fedeltà | Scheda prezzi canonica **(da scrivere)** + ToS ✓ |
| Fiducia | Chi siete? Dove siete? Posso fidarmi? Garanzie? | Storia del brand in 3 frasi, sede, soddisfatti-o-rimborsati 14 gg, garanzia legale | Scheda "Chi è EVEA" **(da scrivere)** |
| Opportunità | Come divento promoter? Quanto si guadagna? | Con sponsor → al proprio Promotore; organico → info@myevea.com. Mai cifre | System prompt (già coperto) |

## 3. Tassonomia — CLIENTI POST-ACQUISTO

Il volume principale dei primi mesi. Qui si gioca la fiducia.

| Area | Domande tipo | Linea di risposta | Fonte |
|---|---|---|---|
| Tracking | Dov'è il pacco? Quando arriva? Il tracking non funziona | Stato reale da tool + stima + link GLS. Fermo >4 gg → rassicura + escalation automatica | Tool ✓ + FAQ spedizioni **(da scrivere)** |
| Problemi consegna | Non c'ero, pacco danneggiato, prodotto mancante/sbagliato, non arriva nulla | Casistiche con procedura: secondo tentativo GLS, foto per danni, escalation con dati raccolti | FAQ spedizioni **(da scrivere)** |
| Resi e recesso | Come faccio il reso? Ho aperto la busta, posso? Quando arriva il rimborso? | Recesso 14 gg (alimentari aperti esclusi), soddisfatti-o-rimborsati 14 gg via referral, rimborso entro 14 gg. Raccogliere ordine+motivo → escalation per l'avvio | ToS + Codice Condotta ✓ + procedura passo-passo **(da scrivere)** |
| SmartShip gestione | Come sposto la data? Pausa? Annullo? Cambio prodotti? Cambio indirizzo? Pagamento fallito | Guida passo-passo nell'area personale (dove cliccare, cosa succede, da quando vale). Disdetta: 1 tentativo retention poi procedura | **Guida SmartShip passo-passo (da scrivere — PRIORITÀ 2)** |
| Coupon fedeltà | Quando arriva? Quanto vale? Come lo uso? Perché non l'ho ricevuto? | Regola trimestrale (2/3 ordine più basso, min €26,73 max €60), condizioni di continuità, come si applica | Piano Compensi ✓ + FAQ **(da estrarre)** |
| Account | Password, fattura/ricevuta, cambio email | Password → procedura self-service; resto → escalation | FAQ account **(da scrivere)** |

## 4. Tassonomia — PROMOTER

Il pubblico beta di agosto. Qui si gioca l'adozione da parte della rete.

| Area | Domande tipo | Linea di risposta | Fonte |
|---|---|---|---|
| Backoffice operativo | Dove trovo il link referral? Come iscrivo un cliente/promoter? Dove vedo la rete? Come chiedo il prelievo? Dove scarico la nota di compenso? | Guida operativa puntuale ("vai in… clicca…"). È la #1 richiesta prevista dai nuovi Founder | **Guida Backoffice (da scrivere — PRIORITÀ 3)** |
| Piano Compensi | Come funziona [ogni bonus]? Requisiti rank? Cos'è PQV/GV/TV? Regola 60%? Retail rule? | Meccanica esatta dal documento + disclaimer risultati + rimando al PDF. Mai proiezioni | Piano Compensi v1.1 ✓ |
| Pagamenti | Quando pagano? Perché la commissione è diversa da quanto mi aspettavo? Prelievo minimo? | Wallet il 15 del mese, prelievo min €25, clawback 120 gg. Discrepanze specifiche → verifica dati con tool, se non torna → escalation | Piano Compensi ✓ + tool ✓ |
| Fiscale | Quando serve la P.IVA? Come funziona la ritenuta? INPS? Soglia? | Regole generali (€5.000 netti / €6.410,26 lordi, 23% sul 78%, Gestione Separata) + sempre: per il tuo caso → commercialista | **FAQ fiscale (da scrivere — materiale già pronto dalle sessioni con Mariarita)** |
| Contratto | Rinnovo? Recesso? Tesserino? Cosa mi è vietato? | Dai documenti contrattuali, risposte puntuali | Lettera Incarico + Codice Condotta ✓ |
| "Posso dirlo?" | Posso scrivere che il Reishi aiuta X? Posso postare i miei guadagni? Devo mettere #ad? | Risposte sì/no nette con la regola citata e l'alternativa conforme ("puoi dire così: …"). Area ad altissimo valore: previene violazioni della rete | **FAQ claim per promoter (da scrivere dal Manuale Claim — PRIORITÀ 4)** |
| Clienti del promoter | "Il mio cliente non ha ricevuto il pacco, controlla tu" | **Regola privacy:** dati aggregati della rete sì, dettagli ordine del cliente no → "fai scrivere il tuo cliente direttamente qui, lo assisto io" | System prompt **(da integrare — vedi §7)** |
| Founder Program | Domande su viaggio, condizioni founder | Solo informazioni già comunicate ufficialmente; il resto → sponsor o info@ | Scheda Founder **(da scrivere: perimetro del dicibile)** |

## 5. Trasversali (tutti)

Sei un bot? (sì, con naturalezza) · Voglio una persona (escalation immediata senza resistenza) · Orari e contatti · Dati personali/GDPR (registra + escalation, riferimento info@) · Lamentele e toni accesi (ascolto, niente scuse legali, escalation) · Lingue diverse dall'italiano (cortese: per ora solo italiano, resto → info@).

---

## 6. Cosa darle in pasto — inventario

### Già esiste (solo da convertire in chunk KB)
1. Piano Compensi v1.1 ✓ (già indicizzato)
2. Lettera di Incarico v4 ✓
3. Codice di Condotta v3 ✓
4. Allegato C Privacy + Privacy Policy sito ✓
5. Termini e Condizioni sito ✓
6. **Manuale Claim v1.0** → base per la FAQ "posso dirlo?"
7. Pagine prodotto Shopify → verificare che contengano TUTTI i dati etichetta
8. Documentazione HACCP → estrarre conservazione, scadenze, allergeni
9. Materiale fiscale dalle sessioni con la commercialista → base FAQ fiscale

### Da scrivere (in ordine di priorità, con scadenza)

| # | Contenuto | Perché | Entro |
|---|---|---|---|
| 1 | **Schede etichetta 4 prodotti**: ingredienti completi, allergeni, caffeina in mg per porzione, valori nutrizionali, porzioni per confezione, preparazione, conservazione, vegan/gluten-free | Le domande pre-acquisto più frequenti a settembre; unica area tecnica senza rischio claim; oggi EVA non ha questi numeri | **10/08** (prima del beta) |
| 2 | **Guida SmartShip passo-passo**: dove cliccare per pausa/annullo/modifica data/cambio prodotti/indirizzo, cosa succede e da quando | "Vai nell'area personale" non basta: EVA deve guidare click per click | 10/08 |
| 3 | **Guida Backoffice promoter**: referral link, iscrizioni, rete, prelievi, note di compenso, tesserino | I Founder la useranno da subito in beta; complementare ai video Accademia (EVA serve il testo) | **15/08** (prima della Cina) |
| 4 | **FAQ "posso dirlo?"** (~30 casi dal Manuale Claim, formato: domanda → sì/no → perché → alternativa conforme) | Trasforma EVA in strumento di compliance preventiva per la rete | 15/08 |
| 5 | **FAQ spedizioni** (~30 casistiche) | Copre l'80% del volume post-vendita | 25/08 |
| 6 | **FAQ fiscale incaricati** (~15 domande, risposte generali + commercialista) | Le domande arriveranno con le prime commissioni | 25/08 |
| 7 | Scheda "Chi è EVEA" + scheda filiera GanoHerb + scheda prezzi canonica + glossario + scheda Founder (perimetro dicibile) | Completamento | 31/08 |
| 8 | **Risposte pronte per casi delicati**: pacco perso, cliente furioso, richiesta risarcimento, contestazione commissioni | Tono pre-approvato dove l'improvvisazione costa cara | 31/08 |

## 7. Regole di formato KB (per Claude Code)

- Un file markdown per argomento; **chunk = sezione con titolo**; ogni chunk autosufficiente (l'agente riceve chunk isolati, non il file intero).
- **Metadato `audience`** per chunk: `tutti` / `cliente` / `promoter`. searchKnowledgeBase filtra per tipo contatto (es. dati COA e guida backoffice → solo promoter).
- Formato **Q&A esplicito** dove possibile: le domande nel testo migliorano il matching keyword.
- **Un solo posto canonico per ogni numero** (prezzi, giorni, soglie, importi): gli altri chunk rimandano, mai duplicano. Un prezzo aggiornato in due punti su tre = EVA che dà numeri vecchi.
- Ogni chunk con data di aggiornamento. Prezzi e policy: ricontrollo a ogni modifica sito.
- Aggiunta al system prompt (§4 tassonomia promoter): regola "dettagli ordine dei clienti → solo al cliente, mai al promoter; il cliente scrive direttamente".

## 8. Ciclo di miglioramento (la parte che conta ora che è live)

1. **Log settimanale** (30 min, lun mattina): estrarre (a) conversazioni finite in escalation, (b) risposte "non lo so", (c) ricerche KB a vuoto (query searchKnowledgeBase senza risultati — loggarle!).
2. Per ogni buco: nuovo chunk KB o correzione. Obiettivo: ogni domanda vera senza risposta diventa un chunk entro 7 giorni.
3. **Beta Founder = miniera**: 16 persone in viaggio che scrivono a EVA per due settimane. Annunciare EVA nel gruppo WhatsApp del viaggio e chiedere esplicitamente di usarla per ogni dubbio.
4. Metriche mensili: % conversazioni risolte senza escalation (target: 60% al lancio, 75% a fine anno) · tempo medio di risposta umana post-escalation vs promessa 1 ora · test compliance §13 ripetuti a ogni modifica di prompt o KB.
5. Ogni domanda ricorrente in escalation dopo 3+ occorrenze = candidata a nuovo tool o nuova azione (fase 2).

---

**In sintesi:** EVA oggi ha già gambe solide su tracking, policy e Piano Compensi. I quattro buchi da chiudere prima del lancio sono dati etichetta, guida SmartShip, guida Backoffice e FAQ claim — e da lunedì, la KB la scrivono le domande vere dei log.

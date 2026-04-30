# Graph Report - src/pages/user/financial  (2026-04-19)

## Corpus Check
- Corpus is ~11,398 words - fits in a single context window. You may not need a graph.

## Summary
- 176 nodes · 173 edges · 39 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Deposit & Ewallet Module|Deposit & Ewallet Module]]
- [[_COMMUNITY_Wallet APIs (PayoutGiftKYC)|Wallet APIs (Payout/Gift/KYC)]]
- [[_COMMUNITY_Fiscal Calculation Preview|Fiscal Calculation Preview]]
- [[_COMMUNITY_Page Entry Points|Page Entry Points]]
- [[_COMMUNITY_Autofatture Module|Autofatture Module]]
- [[_COMMUNITY_Payout Request Form + 2FA|Payout Request Form + 2FA]]
- [[_COMMUNITY_Card Components (shared)|Card Components (shared)]]
- [[_COMMUNITY_DataList Components (shared)|DataList Components (shared)]]
- [[_COMMUNITY_Fund Transfer Module|Fund Transfer Module]]
- [[_COMMUNITY_Fund Transfer Submit|Fund Transfer Submit]]
- [[_COMMUNITY_Users List Autocomplete|Users List Autocomplete]]
- [[_COMMUNITY_Wallet Main Hub (Tabs)|Wallet Main Hub (Tabs)]]
- [[_COMMUNITY_Payout 2FA Setup|Payout 2FA Setup]]
- [[_COMMUNITY_Sponsor Autocomplete|Sponsor Autocomplete]]
- [[_COMMUNITY_Autofatture Page Cards|Autofatture Page Cards]]
- [[_COMMUNITY_PayNow Form|PayNow Form]]
- [[_COMMUNITY_Filter Cards|Filter Cards]]
- [[_COMMUNITY_Rows Per Page Selector|Rows Per Page Selector]]
- [[_COMMUNITY_Fiscal Threshold Logic|Fiscal Threshold Logic]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]

## God Nodes (most connected - your core abstractions)
1. `RequestForm (payout request)` - 9 edges
2. `Deposit Wallet Page (Index)` - 8 edges
3. `RequestPayout Index page` - 8 edges
4. `Index()` - 7 edges
5. `Autofatture Page (Le Mie Autofatture)` - 7 edges
6. `eWallet Page (Index)` - 6 edges
7. `PendingCommissions page` - 6 edges
8. `useRequestForm (payout form + OTP gate)` - 6 edges
9. `EcommerceCheckout()` - 5 edges
10. `eWallet Summary Card` - 5 edges

## Surprising Connections (you probably didn't know these)
- `PayNow (add credit form)` --semantically_similar_to--> `EcommerceCheckout()`  [INFERRED] [semantically similar]
  src/pages/user/financial/deposit/payNow.js → src\pages\user\financial\deposit\addCredit.js
- `CheckoutCart (deposit cart)` --conceptually_related_to--> `EcommerceCheckout()`  [INFERRED]
  src/pages/user/financial/deposit/checkoutCart.js → src\pages\user\financial\deposit\addCredit.js
- `Index()` --calls--> `useFetchWitPagination()`  [INFERRED]
  src\pages\user\financial\requestPayout\index.js → src\pages\user\financial\hooks\useFetchWithPagination.js
- `Index()` --calls--> `useFetchSummary()`  [INFERRED]
  src\pages\user\financial\requestPayout\index.js → src\pages\user\financial\hooks\useFetchSummary.js
- `Index()` --calls--> `useFundTransfer()`  [INFERRED]
  src\pages\user\financial\requestPayout\index.js → src\pages\user\financial\fundTransfer\hooks\useFundTransfer.js

## Hyperedges (group relationships)
- **Summary + Filter + PaginatedTable pattern across wallet pages** — deposit_index_page, ewallet_index_page, fundtransfer_index_page, concept_summary_filter_table_pattern [INFERRED 0.90]
- **Summary Card tile variants (deposit/ewallet/fundTransfer/autofatture)** — deposit_cards, ewallet_summary_cards, fundtransfer_cards, autofatture_statcard [INFERRED 0.85]
- **Autofatture download flow (list + XML + PDF)** — autofatture_index_page, autofatture_api_list, autofatture_api_xml, autofatture_api_pdf [EXTRACTED 1.00]
- **Payout request flow (form -> 2FA gate -> submit)** — requestPayout_requestForm_RequestForm, useRequestForm_useRequestForm, payoutOtpDialog_PayoutOtpDialog, api_verify_payout_2fa, api_payout_request [EXTRACTED 0.90]
- **Payment type conditional UI (manual/crypto/stripe)** — availablePayouts_AvailablePayouts, bankInfo_BankInfo, coinTypes_CoinTypes, stripeInfo_StripeInfo, concept_PAYOUT_TYPE_IDS [EXTRACTED 0.90]
- **Wallet tabs compose financial pages + KYC gate + gift card** — wallet_WalletPage, wallet_KycGate, wallet_GiftCardTab, requestPayout_index_Index, pendingCommissions_index_PendingCommissions [EXTRACTED 0.90]

## Communities

### Community 0 - "Deposit & Ewallet Module"
Cohesion: 0.12
Nodes (23): EcommerceCheckout(), QontoStepIcon(), User Financial Wallet Module, Summary+Filter+PaginatedTable page pattern, API GET /deposit-wallet?query&page, CheckoutCart (deposit cart), Deposit DataList (stub table), Deposit DataTable (paginated) (+15 more)

### Community 1 - "Wallet APIs (Payout/Gift/KYC)"
Cohesion: 0.12
Nodes (20): API: POST cancel-payout/{id}, API: gift-card / gift-cards, API: GET api/wp/compliance/kyc-status, API: payout-request (GET list / POST submit), API: GET api/user/pending_ewallet, API: GET request-payout-data (summary), DataFilter (month/year/paymentType), PendingCommissions page (+12 more)

### Community 2 - "Fiscal Calculation Preview"
Cohesion: 0.16
Nodes (17): FiscalePreview (fiscal breakdown), getThresholdAlert (INPS soglia 6410), API: GET api/user/available-payouts, API: POST api/wp/payout/calcola (fiscal), API: GET api/wp/payout/totale-annuo, API: POST api/user/verify-payout-2fa, AvailablePayouts (payment-type select), BankInfo (manual payout bank display) (+9 more)

### Community 3 - "Page Entry Points"
Cohesion: 0.18
Nodes (4): Index(), useFetchSummary(), useFetchWitPagination(), useFundTransfer()

### Community 4 - "Autofatture Module"
Cohesion: 0.2
Nodes (11): API api/wp/autofatture/{userId}, API api/wp/nota-compensi/{id}/pdf, API api/wp/autofatture/{id}/xml, Autofatture Page (Le Mie Autofatture), Autofatture StatCard Component, STATUS_CONFIG (in_attesa, inviata, errore_sdi), Fiscal Module (autofatture/payout), Deposit Cards (summary tile) (+3 more)

### Community 5 - "Payout Request Form + 2FA"
Cohesion: 0.33
Nodes (3): RequestForm(), schema(), useRequestForm()

### Community 6 - "Card Components (shared)"
Cohesion: 0.4
Nodes (1): Cards()

### Community 7 - "DataList Components (shared)"
Cohesion: 0.4
Nodes (1): DataList()

### Community 8 - "Fund Transfer Module"
Cohesion: 0.4
Nodes (5): API: GET fund-transfer (paginated), API: POST fund-transfer, useFundForm (RHF form for fund-transfer POST), useFundTransfer (list fund-transfer paginated), UsersList (fund transfer autocomplete)

### Community 9 - "Fund Transfer Submit"
Cohesion: 0.5
Nodes (2): SendForm(), useFundForm()

### Community 10 - "Users List Autocomplete"
Cohesion: 0.5
Nodes (2): UsersList(), useUsersList()

### Community 11 - "Wallet Main Hub (Tabs)"
Cohesion: 0.5
Nodes (0): 

### Community 12 - "Payout 2FA Setup"
Cohesion: 0.67
Nodes (4): API: POST toggle-payout-2fa, API: GET twofa / POST enable-twofa, Payout2faToggle (enable 2FA), SetupAuthenticatorDialog (QR + code)

### Community 13 - "Sponsor Autocomplete"
Cohesion: 0.5
Nodes (4): API: api/user/autocomplete_referrals, sponsorAutoComplete API fn, useUsersList (sponsor-scoped), useUsersList (generic, new)

### Community 14 - "Autofatture Page Cards"
Cohesion: 0.67
Nodes (0): 

### Community 15 - "PayNow Form"
Cohesion: 1.0
Nodes (2): genSchema(), PayNow()

### Community 16 - "Filter Cards"
Cohesion: 0.67
Nodes (1): FilterCard()

### Community 17 - "Rows Per Page Selector"
Cohesion: 0.67
Nodes (1): RowsPerPage()

### Community 18 - "Fiscal Threshold Logic"
Cohesion: 1.0
Nodes (2): FiscalePreview(), getThresholdAlert()

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (2): Deposit RowsPerPage select, eWallet RowsPerPage select

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (1): useFundForm yup schema (wallet/amount/user_id)

## Knowledge Gaps
- **34 isolated node(s):** `API api/wp/autofatture/{userId}`, `API api/wp/autofatture/{id}/xml`, `API api/wp/nota-compensi/{id}/pdf`, `STATUS_CONFIG (in_attesa, inviata, errore_sdi)`, `CheckoutCart (deposit cart)` (+29 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 19`** (2 nodes): `CheckoutCart()`, `checkoutCart.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (2 nodes): `FilterCard()`, `filterCard.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `DataList()`, `dataTable.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `useFetchDepositWallet.js`, `useFetchDepositWallet()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `Summary()`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `useFetchEWallet.js`, `useFetchEWallet()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `useCouponPurchase.js`, `useReferrals()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `sponsorAutoComplete()`, `sponsors.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `useUsersList.js`, `useUsersList()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `BankInfo()`, `bank-info.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `CoinTypes()`, `coin-types.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `PayoutOtpDialog()`, `payout-otp-dialog.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `stripe-info.jsx`, `StripeInfo()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `AvailablePayouts()`, `index.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `use-available-payout.js`, `useAvailableUserPayouts()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `Deposit RowsPerPage select`, `eWallet RowsPerPage select`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `filter.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `useFundForm yup schema (wallet/amount/user_id)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RequestPayout Index page` connect `Wallet APIs (Payout/Gift/KYC)` to `Fiscal Calculation Preview`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `RequestForm (payout request)` connect `Fiscal Calculation Preview` to `Wallet APIs (Payout/Gift/KYC)`, `Payout 2FA Setup`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `Deposit Wallet Page (Index)` connect `Deposit & Ewallet Module` to `Autofatture Module`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Deposit Wallet Page (Index)` (e.g. with `EcommerceCheckout()` and `Summary+Filter+PaginatedTable page pattern`) actually correct?**
  _`Deposit Wallet Page (Index)` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Index()` (e.g. with `useFetchWitPagination()` and `useFetchSummary()`) actually correct?**
  _`Index()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Autofatture Page (Le Mie Autofatture)` (e.g. with `Fiscal Module (autofatture/payout)` and `User Financial Wallet Module`) actually correct?**
  _`Autofatture Page (Le Mie Autofatture)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `API api/wp/autofatture/{userId}`, `API api/wp/autofatture/{id}/xml`, `API api/wp/nota-compensi/{id}/pdf` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
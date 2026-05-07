#!/usr/bin/env python3
"""
Fix soglia INPS: il calcolo totale annuo deve includere anche i prelievi
pending in payout_requests, non solo le autofatture (che esistono solo
DOPO l'approvazione admin).

Bug: 2 prelievi pending da 3900 superavano la soglia perche autofatture
era ancora vuota.

Strategia: usare payout_requests (status NOT IN rejected/cancelled,
deleted_at IS NULL) come fonte unica del lordo annuo. Le autofatture
sono solo viste derivate (FK autofattura_id su payout_requests).

Modifica:
1. AutofatturaController@totaleAnnuo
2. PayoutRepository@payoutRequest
3. HealthCheckController CHECK J
"""
import sys

# === 1. AutofatturaController totaleAnnuo ===
ctrl = '/home/forge/api.myevea.com/current/app/Http/Controllers/Admin/AutofatturaController.php'
with open(ctrl, 'r') as f:
    src = f.read()

OLD_TOT = '''        $anno = date("Y");
        $totale = (float) (DB::table("autofatture")
            ->where("user_id", $userId)
            ->whereYear("created_at", $anno)
            ->where("stato", "!=", "annullata")
            ->sum("lordo") ?? 0);'''

NEW_TOT = '''        $anno = date("Y");
        // Fonte unica: payout_requests (escludendo rejected/cancelled/soft-deleted).
        // Include sia approved sia pending = "impegno totale annuo" che evita
        // bypass della soglia con piu richieste pending contemporanee.
        $totale = (float) (DB::table("payout_requests")
            ->where("user_id", $userId)
            ->whereYear("created_at", $anno)
            ->whereNotIn("status", ["rejected", "cancelled"])
            ->whereNull("deleted_at")
            ->sum("amount") ?? 0);'''

if OLD_TOT not in src:
    print("ERROR ctrl tot anchor not found")
    sys.exit(1)
src = src.replace(OLD_TOT, NEW_TOT)
with open(ctrl, 'w') as f:
    f.write(src)
print("OK AutofatturaController updated")

# === 2. PayoutRepository ===
repo = '/home/forge/api.myevea.com/current/app/Repositories/User/PayoutRepository.php'
with open(repo, 'r') as f:
    src = f.read()

OLD_CALC = '''            $totaleAnno = (float) DB::table('autofatture')
                ->where('user_id', $user->id)
                ->whereYear('created_at', $anno)
                ->where('stato', '!=', 'annullata')
                ->sum('lordo');'''

NEW_CALC = '''            // Fonte unica: payout_requests (escludendo rejected/cancelled/soft-deleted).
            // Include pending non ancora approvati per evitare bypass soglia con piu richieste.
            $totaleAnno = (float) DB::table('payout_requests')
                ->where('user_id', $user->id)
                ->whereYear('created_at', $anno)
                ->whereNotIn('status', ['rejected', 'cancelled'])
                ->whereNull('deleted_at')
                ->sum('amount');'''

if OLD_CALC not in src:
    print("ERROR repo calc anchor not found")
    sys.exit(1)
src = src.replace(OLD_CALC, NEW_CALC)
with open(repo, 'w') as f:
    f.write(src)
print("OK PayoutRepository updated")

# === 3. HealthCheckController CHECK J ===
hc = '/home/forge/api.myevea.com/current/app/Http/Controllers/HealthCheckController.php'
with open(hc, 'r') as f:
    src = f.read()

OLD_J = '''        $offenders = DB::table('autofatture')
            ->select('autofatture.user_id', DB::raw('SUM(autofatture.lordo) as totale_lordo'))
            ->join('users', 'users.id', '=', 'autofatture.user_id')
            ->whereYear('autofatture.created_at', $anno)
            ->where('autofatture.stato', '!=', 'annullata')
            ->where(function ($q) {
                $q->whereNull('users.partita_iva')->orWhere('users.partita_iva', '');
            })
            ->where(function ($q) {
                $q->whereNull('users.regime_fiscale')->orWhere('users.regime_fiscale', '!=', 'partita_iva');
            })
            ->groupBy('autofatture.user_id')
            ->having('totale_lordo', '>', $sogliaInps)
            ->get();'''

NEW_J = '''        // Fonte unica: payout_requests (somma di pending + approved).
        $offenders = DB::table('payout_requests')
            ->select('payout_requests.user_id', DB::raw('SUM(payout_requests.amount) as totale_lordo'))
            ->join('users', 'users.id', '=', 'payout_requests.user_id')
            ->whereYear('payout_requests.created_at', $anno)
            ->whereNotIn('payout_requests.status', ['rejected', 'cancelled'])
            ->whereNull('payout_requests.deleted_at')
            ->where(function ($q) {
                $q->whereNull('users.partita_iva')->orWhere('users.partita_iva', '');
            })
            ->where(function ($q) {
                $q->whereNull('users.regime_fiscale')->orWhere('users.regime_fiscale', '!=', 'partita_iva');
            })
            ->groupBy('payout_requests.user_id')
            ->having('totale_lordo', '>', $sogliaInps)
            ->get();'''

if OLD_J not in src:
    print("ERROR check J anchor not found")
    sys.exit(1)
src = src.replace(OLD_J, NEW_J)
with open(hc, 'w') as f:
    f.write(src)
print("OK HealthCheckController CHECK J updated")
print("DONE")

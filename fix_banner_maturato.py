#!/usr/bin/env python3
"""
Banner soglia INPS: switch da prelievi a maturato annuo.
- Calcolo prelievi resta per il cap effettivo (legge: conta il percepito).
- Banner avvisa preventivamente su quanto e' gia maturato in wallet, anche
  se non ancora prelevato (perche prima o poi sara prelevato).

Modifica: AutofatturaController@totaleAnnuo aggiunge campo maturato_anno
da commission (type=credit, status=yes, ewallet, escludendo gift card e
fund transfer).
"""
import sys

ctrl = '/home/forge/api.myevea.com/current/app/Http/Controllers/Admin/AutofatturaController.php'
with open(ctrl, 'r') as f:
    src = f.read()

OLD = '''        $anno = date("Y");
        // Fonte unica: payout_requests (escludendo rejected/cancelled/soft-deleted).
        // Include sia approved sia pending = "impegno totale annuo" che evita
        // bypass della soglia con piu richieste pending contemporanee.
        $totale = (float) (DB::table("payout_requests")
            ->where("user_id", $userId)
            ->whereYear("created_at", $anno)
            ->whereNotIn("status", ["rejected", "cancelled"])
            ->whereNull("deleted_at")
            ->sum("amount") ?? 0);

        $user = DB::table("users")->where("id", $userId)->first();
        $regime = $user->regime_fiscale ?? null;
        $haPiva = !empty($user->partita_iva) || ($regime === "partita_iva");

        $soglia = \\App\\Services\\FiscaleService::SOGLIA_INPS;
        $residuo = $haPiva ? null : max(0.0, round($soglia - $totale, 2));

        return response()->json([
            "data" => [
                "totale_lordo" => $totale,
                "residuo_soglia" => $residuo,
                "soglia_inps" => $soglia,
                "regime_fiscale" => $regime,
                "ha_partita_iva" => $haPiva,
            ],
        ]);'''

NEW = '''        $anno = date("Y");
        // Prelievi anno (per cap effettivo): payout_requests non rejected/cancelled.
        $totale = (float) (DB::table("payout_requests")
            ->where("user_id", $userId)
            ->whereYear("created_at", $anno)
            ->whereNotIn("status", ["rejected", "cancelled"])
            ->whereNull("deleted_at")
            ->sum("amount") ?? 0);

        // Maturato anno (per banner preventivo): commissioni effettivamente
        // accreditate in wallet (type=credit, payment_status=yes, ewallet)
        // escludendo gift card, fund transfer e payout request.
        $maturato = (float) (DB::table("commission")
            ->where("user_id", $userId)
            ->whereYear("created_at", $anno)
            ->where("type", "credit")
            ->where("payment_status", "yes")
            ->where("wallet_type", "ewallet")
            ->whereNotIn("payment_type", ["gift_card_conversion", "fund_transfer", "payout_request"])
            ->sum("payable_amount") ?? 0);

        $user = DB::table("users")->where("id", $userId)->first();
        $regime = $user->regime_fiscale ?? null;
        $haPiva = !empty($user->partita_iva) || ($regime === "partita_iva");

        $soglia = \\App\\Services\\FiscaleService::SOGLIA_INPS;
        $residuo = $haPiva ? null : max(0.0, round($soglia - $totale, 2));

        return response()->json([
            "data" => [
                "totale_lordo" => $totale,
                "maturato_anno" => round($maturato, 2),
                "residuo_soglia" => $residuo,
                "soglia_inps" => $soglia,
                "regime_fiscale" => $regime,
                "ha_partita_iva" => $haPiva,
            ],
        ]);'''

if OLD not in src:
    print("ERROR anchor not found")
    sys.exit(1)
src = src.replace(OLD, NEW)
with open(ctrl, 'w') as f:
    f.write(src)
print("OK AutofatturaController updated with maturato_anno")

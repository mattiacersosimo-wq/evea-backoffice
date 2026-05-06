#!/usr/bin/env python3
"""
Patch backend per soft-block parziale soglia INPS (€6.410,26).

1. AutofatturaController@totaleAnnuo  -> espone anche residuo_soglia + regime_fiscale + soglia_inps
2. PayoutRepository@payoutRequest      -> cap automatico se non-P.IVA e supera soglia
"""
import sys

# === 1. AutofatturaController: estendi totaleAnnuo ===
ctrl = '/home/forge/api.myevea.com/current/app/Http/Controllers/Admin/AutofatturaController.php'
with open(ctrl, 'r') as f:
    src = f.read()

OLD_TOTALE = '''    /**
     * GET /api/wp/payout/totale-annuo
     *
     * Restituisce il totale lordo percepito dal promoter autenticato nell anno corrente.
     */
    public function totaleAnnuo(Request $request)
    {
        $userId = $request->user()->id ?? null;

        if (!$userId) {
            return response()->json(["data" => ["totale_lordo" => 0]]);
        }

        $anno = date("Y");
        $totale = DB::table("autofatture")
            ->where("user_id", $userId)
            ->whereYear("created_at", $anno)
            ->where("stato", "!=", "annullata")
            ->sum("lordo") ?? 0;

        return response()->json(["data" => ["totale_lordo" => (float) $totale]]);
    }'''

NEW_TOTALE = '''    /**
     * GET /api/wp/payout/totale-annuo
     *
     * Restituisce il totale lordo percepito dal promoter autenticato nell anno corrente,
     * piu il residuo soglia INPS e il regime fiscale (per banner / soft-block FE).
     */
    public function totaleAnnuo(Request $request)
    {
        $userId = $request->user()->id ?? null;

        if (!$userId) {
            return response()->json([
                "data" => [
                    "totale_lordo" => 0,
                    "residuo_soglia" => \\App\\Services\\FiscaleService::SOGLIA_INPS,
                    "soglia_inps" => \\App\\Services\\FiscaleService::SOGLIA_INPS,
                    "regime_fiscale" => null,
                    "ha_partita_iva" => false,
                ],
            ]);
        }

        $anno = date("Y");
        $totale = (float) (DB::table("autofatture")
            ->where("user_id", $userId)
            ->whereYear("created_at", $anno)
            ->where("stato", "!=", "annullata")
            ->sum("lordo") ?? 0);

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
        ]);
    }'''

if OLD_TOTALE not in src:
    print("ERROR: AutofatturaController totaleAnnuo anchor not found")
    sys.exit(1)
src = src.replace(OLD_TOTALE, NEW_TOTALE)
with open(ctrl, 'w') as f:
    f.write(src)
print("OK AutofatturaController updated")

# === 2. PayoutRepository: cap automatico al residuo soglia ===
repo = '/home/forge/api.myevea.com/current/app/Repositories/User/PayoutRepository.php'
with open(repo, 'r') as f:
    src = f.read()

OLD_CALC = '''            // Fiscal calculation
            $fiscale = new FiscaleService();
            $lordo = (float) $request->amount;
            $haPartitaIva = !empty($user->partita_iva) || ($user->regime_fiscale ?? '') === 'partita_iva';
            $tipoInps = $user->tipo_inps ?? 'standard';
            $anno = date('Y');
            $totaleAnno = (float) DB::table('autofatture')
                ->where('user_id', $user->id)
                ->whereYear('created_at', $anno)
                ->where('stato', '!=', 'annullata')
                ->sum('lordo');
            $calcolo = $fiscale->calcolaPayout($lordo, $totaleAnno, $haPartitaIva, $tipoInps);'''

NEW_CALC = '''            // Fiscal calculation
            $fiscale = new FiscaleService();
            $lordo = (float) $request->amount;
            $haPartitaIva = !empty($user->partita_iva) || ($user->regime_fiscale ?? '') === 'partita_iva';
            $tipoInps = $user->tipo_inps ?? 'standard';
            $anno = date('Y');
            $totaleAnno = (float) DB::table('autofatture')
                ->where('user_id', $user->id)
                ->whereYear('created_at', $anno)
                ->where('stato', '!=', 'annullata')
                ->sum('lordo');

            // ── Soft-block parziale soglia INPS €6.410,26 (solo non-P.IVA) ──
            $eccedenzaBloccata = 0.0;
            $sogliaSuperata = false;
            if (!$haPartitaIva) {
                $residuo = max(0.0, round(FiscaleService::SOGLIA_INPS - $totaleAnno, 2));
                if ($residuo <= 0.0) {
                    // Gia sopra soglia annua: blocco totale, deve aprire P.IVA
                    return response()->json([
                        'status' => false,
                        'message' => 'Hai raggiunto la soglia annua INPS di euro 6.410,26. Apri Partita IVA per ricevere ulteriori payout. Il saldo resta nel tuo wallet.',
                        'residuo_soglia' => 0,
                        'soglia_inps' => FiscaleService::SOGLIA_INPS,
                    ], 422);
                }
                if ($lordo > $residuo) {
                    // Cap automatico: paga residuo, eccedenza resta in wallet (non decrementata)
                    $eccedenzaBloccata = round($lordo - $residuo, 2);
                    $lordo = round($residuo, 2);
                    $request['amount'] = $lordo;
                    $request['admin_fee_deducted'] = $lordo * .01 * $adminFeePercent;
                    $request['released_amount'] = $lordo - $request['admin_fee_deducted'];
                    $sogliaSuperata = true;
                }
            }

            $calcolo = $fiscale->calcolaPayout($lordo, $totaleAnno, $haPartitaIva, $tipoInps);'''

if OLD_CALC not in src:
    print("ERROR: PayoutRepository calc anchor not found")
    sys.exit(1)
src = src.replace(OLD_CALC, NEW_CALC)

# Aggiorno anche il messaggio di successo per includere info eccedenza
OLD_MSG = '''            $message = "Successfully requested for payout.";
            $translateMsg = UserProfile::translateResponse($message, Auth::user()->id);
            return response()->json([
                'status' => true,
                'message' => $translateMsg,
                'calcolo' => $calcolo,
            ], 200);'''

NEW_MSG = '''            if ($sogliaSuperata) {
                $message = 'Richiesta accettata per euro ' . number_format($lordo, 2, ',', '.') . ' (residuo soglia INPS). Eccedenza euro ' . number_format($eccedenzaBloccata, 2, ',', '.') . ' resta nel wallet finche non apri Partita IVA.';
            } else {
                $message = "Successfully requested for payout.";
            }
            $translateMsg = UserProfile::translateResponse($message, Auth::user()->id);
            return response()->json([
                'status' => true,
                'message' => $translateMsg,
                'calcolo' => $calcolo,
                'eccedenza_bloccata' => $eccedenzaBloccata,
                'soglia_inps_capped' => $sogliaSuperata,
            ], 200);'''

if OLD_MSG not in src:
    print("ERROR: PayoutRepository success anchor not found")
    sys.exit(1)
src = src.replace(OLD_MSG, NEW_MSG)

with open(repo, 'w') as f:
    f.write(src)
print("OK PayoutRepository updated")
print("DONE")

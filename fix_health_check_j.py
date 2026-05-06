#!/usr/bin/env python3
"""
Aggiunge CHECK J in HealthCheckController->checkOperations:
nessun promoter non-P.IVA dovrebbe avere autofatture (anno corrente)
con lordo cumulato > soglia INPS €6.410,26.
"""
import sys

path = '/home/forge/api.myevea.com/current/app/Http/Controllers/HealthCheckController.php'
with open(path, 'r') as f:
    src = f.read()

OLD = '''        $ms = round((microtime(true) - $start) * 1000);
        DB::table('system_check_log')->insert(['agent' => 'operations', 'checks_run' => 16, 'alerts_generated' => $alerts, 'duration_ms' => $ms, 'created_at' => Carbon::now()]);
        return ['agent' => 'operations', 'checks' => 16, 'alerts' => $alerts, 'ms' => $ms];
    }

    private function checkBusiness()'''

NEW = '''        // CHECK J — soglia INPS €6.410,26: nessun promoter senza P.IVA dovrebbe averla superata.
        // Il soft-block in PayoutRepository@payoutRequest cap automatico al residuo.
        // Se questa invariante salta -> bug nel cap (admin ha approvato manualmente bypass, o calcolo sbagliato).
        $sogliaInps = \\App\\Services\\FiscaleService::SOGLIA_INPS;
        $anno = date('Y');
        $offenders = DB::table('autofatture')
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
            ->get();

        DB::table('system_alerts')->where('agent', 'operations')
            ->where('title', 'LIKE', '%soglia INPS superata senza P.IVA%')->where('resolved', 0)->delete();
        if ($offenders->count() > 0) {
            $sample = $offenders->take(5)->map(function ($o) {
                return 'user_id=' . $o->user_id . ' (€' . number_format($o->totale_lordo, 2, ',', '.') . ')';
            })->implode(', ');
            DB::table('system_alerts')->insert([
                'agent' => 'operations', 'severity' => 'critical',
                'title' => $offenders->count() . ' promoter con soglia INPS superata senza P.IVA',
                'message' => 'Invariante J violata: ' . $sample . (
                    $offenders->count() > 5 ? ' ...' : ''
                ) . '. Il soft-block parziale dovrebbe impedirlo. Verifica PayoutRepository@payoutRequest e eventuali payout approvati manualmente. Soglia: €' . number_format($sogliaInps, 2, ',', '.') . '.',
                'created_at' => Carbon::now(),
            ]);
            $alerts++;
        }

        $ms = round((microtime(true) - $start) * 1000);
        DB::table('system_check_log')->insert(['agent' => 'operations', 'checks_run' => 17, 'alerts_generated' => $alerts, 'duration_ms' => $ms, 'created_at' => Carbon::now()]);
        return ['agent' => 'operations', 'checks' => 17, 'alerts' => $alerts, 'ms' => $ms];
    }

    private function checkBusiness()'''

if OLD not in src:
    print("ERROR: anchor not found")
    sys.exit(1)
src = src.replace(OLD, NEW)
with open(path, 'w') as f:
    f.write(src)
print("OK CHECK J added")

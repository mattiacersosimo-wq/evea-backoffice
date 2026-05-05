import sys

path = '/home/forge/api.myevea.com/current/app/Http/Controllers/HealthCheckController.php'
with open(path, 'r') as f:
    content = f.read()

OLD = """        $ms = round((microtime(true) - $start) * 1000);
        DB::table('system_check_log')->insert(['agent' => 'operations', 'checks_run' => 15, 'alerts_generated' => $alerts, 'duration_ms' => $ms, 'created_at' => Carbon::now()]);
        return ['agent' => 'operations', 'checks' => 15, 'alerts' => $alerts, 'ms' => $ms];
    }

    private function checkBusiness()"""

NEW = """        // CHECK I — Coupon 3FF / ROB orfani
        // Invariante: chi qualifica per 3FF nel mese precedente deve avere
        // un coupon emesso nel mese corrente. Chi qualifica per ROB (3 mesi
        // consecutivi + min_qv corrente) deve avere coupon nel ciclo.

        $lastMonthStart = Carbon::now()->startOfMonth()->subMonth();
        $lastMonthEnd = $lastMonthStart->copy()->endOfMonth();
        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();
        $missingCoupons = [];

        // I-3FF
        $threeFFSetting = DB::table('three_for_free_settings')->where('is_active', 1)->first();
        if ($threeFFSetting) {
            $potential3FF = DB::table('users as u')
                ->join('cart as c', 'c.user_id', '=', 'u.id')
                ->where('u.is_promoter', 1)->where('u.is_super_admin', 0)
                ->where('c.order_status', 'finished')
                ->whereBetween('c.created_at', [$lastMonthStart, $lastMonthEnd])
                ->groupBy('u.id', 'u.username')
                ->havingRaw('SUM(c.qualification_value) >= ?', [$threeFFSetting->personal_order_qv])
                ->select('u.id', 'u.username')
                ->get();

            foreach ($potential3FF as $p) {
                $directCustomerIds = DB::table('tree_sponsor_plan as t')
                    ->join('users as cu', 'cu.id', '=', 't.user_id')
                    ->where('t.sponsor', $p->id)
                    ->where('cu.is_promoter', 0)
                    ->pluck('cu.id');
                if ($directCustomerIds->isEmpty()) continue;

                $qualifiedCustomers = DB::table('cart')
                    ->select('user_id')
                    ->whereIn('user_id', $directCustomerIds)
                    ->where('order_status', 'finished')
                    ->where('user_type_at_order', 'customer')
                    ->whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])
                    ->groupBy('user_id')
                    ->havingRaw('SUM(qualification_value) >= ?', [$threeFFSetting->customer_min_qv])
                    ->pluck('user_id')
                    ->count();

                if ($qualifiedCustomers < (int) $threeFFSetting->required_customers) continue;

                $hasCoupon = DB::table('store_coupons')
                    ->where('user_id', $p->id)
                    ->where('type', '3ff_programe')
                    ->whereBetween('created_at', [$currentMonthStart, $currentMonthEnd])
                    ->exists();
                if (!$hasCoupon) {
                    $missingCoupons[] = '3FF:' . $p->username;
                }
            }
        }

        // I-ROB: semplificato, controllo solo che chi ha qualificato 3 mesi
        // consecutivi (cart con almeno un acquisto nel mese) e ha PQV >= min_qv
        // questo mese abbia un coupon rob_bonus negli ultimi requiredMonths.
        $robSetting = DB::table('recurring_order_bonus_settings')->where('is_active', 1)->first();
        if ($robSetting) {
            $requiredMonths = (int) $robSetting->required_consecutive_months;
            $minQv = (float) $robSetting->min_qv;
            $robBlockFrom = Carbon::now()->subMonths($requiredMonths - 1)->startOfMonth();

            $potentialROB = DB::table('users as u')
                ->join('cart as c', 'c.user_id', '=', 'u.id')
                ->where('u.is_promoter', 1)->where('u.is_super_admin', 0)
                ->where('c.order_status', 'finished')
                ->whereBetween('c.created_at', [$currentMonthStart, $currentMonthEnd])
                ->groupBy('u.id', 'u.username')
                ->havingRaw('SUM(c.qualification_value) >= ?', [$minQv])
                ->select('u.id', 'u.username')
                ->get();

            foreach ($potentialROB as $p) {
                $consecutive = 0;
                for ($i = 1; $i <= $requiredMonths; $i++) {
                    $check = Carbon::now()->subMonths($i);
                    $hasOrder = DB::table('cart')
                        ->where('user_id', $p->id)
                        ->where('order_status', 'finished')
                        ->whereYear('created_at', $check->year)
                        ->whereMonth('created_at', $check->month)
                        ->exists();
                    if ($hasOrder) { $consecutive++; } else { break; }
                }
                if ($consecutive < $requiredMonths) continue;

                $hasCoupon = DB::table('store_coupons')
                    ->where('user_id', $p->id)
                    ->where('type', 'rob_bonus')
                    ->where('created_at', '>=', $robBlockFrom)
                    ->exists();
                if (!$hasCoupon) {
                    $missingCoupons[] = 'ROB:' . $p->username;
                }
            }
        }

        DB::table('system_alerts')->where('agent', 'operations')
            ->where('title', 'LIKE', '%coupon orfani%')->where('resolved', 0)->delete();
        if (!empty($missingCoupons)) {
            $sample = implode(', ', array_slice($missingCoupons, 0, 5));
            DB::table('system_alerts')->insert([
                'agent' => 'operations', 'severity' => 'critical',
                'title' => count($missingCoupons) . ' coupon orfani (3FF / ROB)',
                'message' => 'Promoter qualificati che non hanno ricevuto il coupon: '
                    . $sample . (count($missingCoupons) > 5 ? ' ...' : '')
                    . '. Lanciare manualmente commission:threeff o consecutivePurchaseCoupon prima di fine mese.',
                'created_at' => Carbon::now(),
            ]);
            $alerts++;
        }

        $ms = round((microtime(true) - $start) * 1000);
        DB::table('system_check_log')->insert(['agent' => 'operations', 'checks_run' => 16, 'alerts_generated' => $alerts, 'duration_ms' => $ms, 'created_at' => Carbon::now()]);
        return ['agent' => 'operations', 'checks' => 16, 'alerts' => $alerts, 'ms' => $ms];
    }

    private function checkBusiness()"""

if OLD not in content:
    print("ERROR: target not found")
    sys.exit(1)

content = content.replace(OLD, NEW)
with open(path, 'w') as f:
    f.write(content)
print("OK Check I added")

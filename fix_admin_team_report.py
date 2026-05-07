#!/usr/bin/env python3
"""
Estende teamDetails e stats per accettare ?user_id=X quando l'autenticato e' super_admin.
Permette al pannello admin di visualizzare il widget Report Team di un qualunque promoter.
"""
import sys

ctrl = '/home/forge/api.myevea.com/current/app/Http/Controllers/Admin/DashboardController.php'
with open(ctrl, 'r') as f:
    src = f.read()

# === 1. teamDetails ===
OLD_TD = '''    public function teamDetails(Request $request)
    {
        $userId = $request->user()->id ?? null;
        if (!$userId) {
            return response()->json(['data' => []]);
        }'''

NEW_TD = '''    public function teamDetails(Request $request)
    {
        $authUser = $request->user();
        $userId = $authUser->id ?? null;
        // Admin override: solo super_admin puo richiedere il team di un altro user via ?user_id=X
        $qUid = $request->query('user_id');
        if ($qUid && $authUser && (int) ($authUser->is_super_admin ?? 0) === 1) {
            $userId = (int) $qUid;
        }
        if (!$userId) {
            return response()->json(['data' => []]);
        }'''

if OLD_TD not in src:
    print("ERROR teamDetails anchor not found")
    sys.exit(1)
src = src.replace(OLD_TD, NEW_TD)

# === 2. stats ===
OLD_ST = '''    public function stats(Request $request)
    {
        $userId = $request->user()->id ?? null;
        if (!$userId) {
            return response()->json(['data' => ['tasso_riordine' => 0, 'conversione_referral' => 0, 'clienti_smartship' => 0, 'promoter_attivi' => 0]]);
        }'''

NEW_ST = '''    public function stats(Request $request)
    {
        $authUser = $request->user();
        $userId = $authUser->id ?? null;
        $qUid = $request->query('user_id');
        if ($qUid && $authUser && (int) ($authUser->is_super_admin ?? 0) === 1) {
            $userId = (int) $qUid;
        }
        if (!$userId) {
            return response()->json(['data' => ['tasso_riordine' => 0, 'conversione_referral' => 0, 'clienti_smartship' => 0, 'promoter_attivi' => 0]]);
        }'''

if OLD_ST not in src:
    print("ERROR stats anchor not found")
    sys.exit(1)
src = src.replace(OLD_ST, NEW_ST)

with open(ctrl, 'w') as f:
    f.write(src)
print("OK DashboardController extended (teamDetails + stats accept ?user_id for admin)")

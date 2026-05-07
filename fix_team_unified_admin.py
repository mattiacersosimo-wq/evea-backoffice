#!/usr/bin/env python3
"""
ReportsController.teamUnified: super_admin puo' vedere il team di
qualunque utente, saltando il check downline.

Modifica: wrappa il check downline esistente in un else,
aggiungendo branch admin che setta userId/breadcrumb direttamente.
"""
import sys

ctrl = '/home/forge/api.myevea.com/current/app/Http/Controllers/ReportsController.php'
with open(ctrl, 'r') as f:
    src = f.read()

OLD = '''        $viewAs = (int) $request->query('view_as', 0);
        $userId = $authUserId;
        $breadcrumb = [];

        if ($viewAs > 0 && $viewAs !== $authUserId) {
            // Verify view_as user is in our downline (BFS check)
            $isInDownline = false;'''

NEW = '''        $viewAs = (int) $request->query('view_as', 0);
        $userId = $authUserId;
        $breadcrumb = [];
        $isSuperAdmin = (int) (Auth::user()->is_super_admin ?? 0) === 1;

        // Super admin: salta il check downline e imposta direttamente il target.
        if ($viewAs > 0 && $viewAs !== $authUserId && $isSuperAdmin) {
            $userId = $viewAs;
            $targetUsername = DB::table('users')->where('id', $viewAs)->value('username');
            $breadcrumb = [
                ['user_id' => $viewAs, 'username' => $targetUsername ?: ('user#' . $viewAs)],
            ];
        } elseif ($viewAs > 0 && $viewAs !== $authUserId) {
            // Verify view_as user is in our downline (BFS check)
            $isInDownline = false;'''

if OLD not in src:
    print("ERROR teamUnified anchor not found")
    sys.exit(1)
src = src.replace(OLD, NEW)
with open(ctrl, 'w') as f:
    f.write(src)
print("OK ReportsController.teamUnified extended for super_admin")

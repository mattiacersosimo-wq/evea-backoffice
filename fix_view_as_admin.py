#!/usr/bin/env python3
"""
Estende /api/wp/income-report e /api/wp/reports/qualifications per
accettare ?view_as=X se l'autenticato e' is_super_admin=1.
"""
import sys

# === 1. IncomeReportController ===
ctrl = '/home/forge/api.myevea.com/current/app/Http/Controllers/IncomeReportController.php'
with open(ctrl, 'r') as f:
    src = f.read()

OLD_INC = '''    public function index(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['error' => 'Non autenticato'], 401);
        }'''

NEW_INC = '''    public function index(Request $request)
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['error' => 'Non autenticato'], 401);
        }
        // Admin override: super_admin puo richiedere il report di un altro user.
        $viewAs = (int) $request->query('view_as', 0);
        if ($viewAs > 0 && $viewAs !== $userId && (int) (Auth::user()->is_super_admin ?? 0) === 1) {
            $userId = $viewAs;
        }'''

if OLD_INC not in src:
    print("ERROR IncomeReport anchor not found")
    sys.exit(1)
src = src.replace(OLD_INC, NEW_INC)
with open(ctrl, 'w') as f:
    f.write(src)
print("OK IncomeReportController updated")

# === 2. ReportsController.qualifications ===
ctrl = '/home/forge/api.myevea.com/current/app/Http/Controllers/ReportsController.php'
with open(ctrl, 'r') as f:
    src = f.read()

OLD_Q = '''    public function qualifications(Request $request)
    {
        try {
        $userId = Auth::id();
        if (!$userId) return response()->json(['error' => 'Non autenticato'], 401);'''

NEW_Q = '''    public function qualifications(Request $request)
    {
        try {
        $userId = Auth::id();
        if (!$userId) return response()->json(['error' => 'Non autenticato'], 401);
        // Admin override: super_admin puo richiedere le qualifiche di un altro user.
        $viewAs = (int) $request->query('view_as', 0);
        if ($viewAs > 0 && $viewAs !== $userId && (int) (Auth::user()->is_super_admin ?? 0) === 1) {
            $userId = $viewAs;
        }'''

if OLD_Q not in src:
    print("ERROR Qualifications anchor not found")
    sys.exit(1)
src = src.replace(OLD_Q, NEW_Q)
with open(ctrl, 'w') as f:
    f.write(src)
print("OK ReportsController.qualifications updated")
print("DONE")

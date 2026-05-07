#!/usr/bin/env python3
"""
Aggiunge top_commissions + team_commissions all'endpoint leaderboard.
Usata anche dalla pagina admin/report/earners (sostituisce Top Earners).
"""
import sys

path = '/home/forge/api.myevea.com/current/app/Http/Controllers/ReportsController.php'
with open(path, 'r') as f:
    src = f.read()

# Inserisco il blocco commissions DOPO teamAchievers (poco prima di "// ── Posizione utente")
# Anchor: la riga `// ── Posizione utente nelle classifiche globali ──`
ANCHOR = "        // ── Posizione utente nelle classifiche globali ──"

INSERT = '''        // ═══════════════════════════════════════
        // CLASSIFICA COMMISSIONI (Globale + Team)
        // Somma payable_amount nel periodo, esclusi gift card/fund/payout
        // ═══════════════════════════════════════
        $excludedTypes = ['gift_card_conversion', 'fund_transfer', 'payout_request'];

        $topCommissions = DB::table('commission')
            ->join('users', 'commission.user_id', '=', 'users.id')
            ->leftJoin('user_profile', 'commission.user_id', '=', 'user_profile.user_id')
            ->whereNull('commission.deleted_at')
            ->where('commission.type', 'credit')
            ->where('commission.payment_status', 'yes')
            ->whereNotIn('commission.payment_type', $excludedTypes)
            ->whereBetween('commission.created_at', [$start, $end])
            ->select(
                'commission.user_id',
                'users.username',
                'users.rank_id',
                'user_profile.first_name',
                'user_profile.last_name',
                DB::raw('SUM(commission.payable_amount) as total_earned')
            )
            ->groupBy('commission.user_id', 'users.username', 'users.rank_id', 'user_profile.first_name', 'user_profile.last_name')
            ->orderByDesc('total_earned')
            ->get()
            ->map(function ($r) {
                $rankName = DB::table('settings_rank')->where('id', $r->rank_id)->value('rank_name');
                return [
                    'user_id' => $r->user_id,
                    'username' => $r->username,
                    'name' => trim(($r->first_name ?? '') . ' ' . ($r->last_name ?? '')) ?: $r->username,
                    'rank' => $rankName ?? 'Associate',
                    'total_earned' => round((float) $r->total_earned, 2),
                ];
            });

        $teamCommissions = $allTeamIds->isEmpty() ? collect() : DB::table('commission')
            ->join('users', 'commission.user_id', '=', 'users.id')
            ->leftJoin('user_profile', 'commission.user_id', '=', 'user_profile.user_id')
            ->whereNull('commission.deleted_at')
            ->where('commission.type', 'credit')
            ->where('commission.payment_status', 'yes')
            ->whereNotIn('commission.payment_type', $excludedTypes)
            ->whereIn('commission.user_id', $allTeamIds)
            ->whereBetween('commission.created_at', [$start, $end])
            ->select(
                'commission.user_id',
                'users.username',
                'users.rank_id',
                'user_profile.first_name',
                'user_profile.last_name',
                DB::raw('SUM(commission.payable_amount) as total_earned')
            )
            ->groupBy('commission.user_id', 'users.username', 'users.rank_id', 'user_profile.first_name', 'user_profile.last_name')
            ->orderByDesc('total_earned')
            ->get()
            ->map(function ($r) {
                $rankName = DB::table('settings_rank')->where('id', $r->rank_id)->value('rank_name');
                return [
                    'user_id' => $r->user_id,
                    'username' => $r->username,
                    'name' => trim(($r->first_name ?? '') . ' ' . ($r->last_name ?? '')) ?: $r->username,
                    'rank' => $rankName ?? 'Associate',
                    'total_earned' => round((float) $r->total_earned, 2),
                ];
            });

''' + ANCHOR

if ANCHOR not in src:
    print("ERROR anchor not found")
    sys.exit(1)
src = src.replace(ANCHOR, INSERT, 1)

# Inserisco posizione "commissions" e dataKey nel return
RETURN_OLD = '''            // GLOBALI
            \'top_gv\'         => $topEarners,     // classifica GV globale (nome campo retro-compat con frontend)
            \'top_earners\'    => $topEarners,     // alias retro-compat
            \'top_recruiters\' => $topRecruiters,
            \'top_achievers\'  => $topAchievers,
            // TEAM
            \'team_gv\'         => $teamEarners,
            \'team_earners\'    => $teamEarners,   // alias retro-compat
            \'team_recruiters\' => $teamRecruiters,
            \'team_achievers\'  => $teamAchievers,'''

RETURN_NEW = '''            // GLOBALI
            \'top_gv\'         => $topEarners,     // classifica GV globale (nome campo retro-compat con frontend)
            \'top_earners\'    => $topEarners,     // alias retro-compat
            \'top_recruiters\' => $topRecruiters,
            \'top_achievers\'  => $topAchievers,
            \'top_commissions\' => $topCommissions,
            // TEAM
            \'team_gv\'         => $teamEarners,
            \'team_earners\'    => $teamEarners,   // alias retro-compat
            \'team_recruiters\' => $teamRecruiters,
            \'team_achievers\'  => $teamAchievers,
            \'team_commissions\' => $teamCommissions,'''

if RETURN_OLD not in src:
    print("ERROR return anchor not found")
    sys.exit(1)
src = src.replace(RETURN_OLD, RETURN_NEW)

# Aggiungo posizione utente per commissioni
POS_OLD = '''            \'my_positions\' => [
                \'gv\'         => [\'position\' => $myGvPosition, \'value\' => round($myGv, 2), \'unit\' => \'gv\'],
                \'recruiters\' => [\'position\' => $myRecruitsPosition, \'value\' => $myRecruits, \'unit\' => \'count\'],
                \'achievers\'  => [\'position\' => $myRankPosition, \'value\' => $myRankAchieved, \'unit\' => \'rank\'],
            ],'''

POS_NEW = '''            \'my_positions\' => [
                \'gv\'         => [\'position\' => $myGvPosition, \'value\' => round($myGv, 2), \'unit\' => \'gv\'],
                \'recruiters\' => [\'position\' => $myRecruitsPosition, \'value\' => $myRecruits, \'unit\' => \'count\'],
                \'achievers\'  => [\'position\' => $myRankPosition, \'value\' => $myRankAchieved, \'unit\' => \'rank\'],
                \'commissions\' => [\'position\' => $myCommissionsPosition, \'value\' => round($myCommissions, 2), \'unit\' => \'eur\'],
            ],'''

if POS_OLD not in src:
    print("ERROR positions anchor not found")
    sys.exit(1)
src = src.replace(POS_OLD, POS_NEW)

# Calcolo posizione mie commissioni - inserito DOPO il calcolo del rank position
RANK_DONE_ANCHOR = '''        $myRankPosition = null;
        if ($myTopRankRow) {'''

RANK_DONE_INSERT = '''        // 4) Commissioni globale - posizione e valore
        $myCommissions = (float) DB::table(\'commission\')
            ->where(\'user_id\', $userId)
            ->whereNull(\'deleted_at\')
            ->where(\'type\', \'credit\')
            ->where(\'payment_status\', \'yes\')
            ->whereNotIn(\'payment_type\', $excludedTypes)
            ->whereBetween(\'created_at\', [$start, $end])
            ->sum(\'payable_amount\');
        $myCommissionsPosition = $myCommissions > 0 ? DB::table(\'commission\')
            ->whereNull(\'deleted_at\')
            ->where(\'type\', \'credit\')
            ->where(\'payment_status\', \'yes\')
            ->whereNotIn(\'payment_type\', $excludedTypes)
            ->whereBetween(\'created_at\', [$start, $end])
            ->select(\'user_id\', DB::raw(\'SUM(payable_amount) as total\'))
            ->groupBy(\'user_id\')
            ->having(\'total\', \'>\', $myCommissions)
            ->get()->count() + 1 : null;

        $myRankPosition = null;
        if ($myTopRankRow) {'''

if RANK_DONE_ANCHOR not in src:
    print("ERROR rank done anchor not found")
    sys.exit(1)
src = src.replace(RANK_DONE_ANCHOR, RANK_DONE_INSERT, 1)

with open(path, 'w') as f:
    f.write(src)
print("OK leaderboard endpoint extended with commissions")

import sys

path = '/home/forge/api.myevea.com/current/app/Http/Controllers/HealthCheckController.php'
with open(path, 'r') as f:
    content = f.read()

OLD = """            LEFT JOIN (
                SELECT user_id, ROUND(SUM(amount), 2) AS total
                FROM payout_requests
                WHERE status IN ('approved', 'pending')
                GROUP BY user_id
            ) p_decremented ON p_decremented.user_id = u.id
            WHERE u.is_super_admin = 0
              AND ABS(ROUND(ub.balance - (IFNULL(c_net.total, 0) - IFNULL(p_decremented.total, 0)), 2)) > 1
            ORDER BY ABS(ROUND(ub.balance - (IFNULL(c_net.total, 0) - IFNULL(p_decremented.total, 0)), 2)) DESC
            LIMIT 20
        \");"""

NEW = """            LEFT JOIN (
                SELECT user_id, ROUND(SUM(amount), 2) AS total
                FROM payout_requests
                WHERE status IN ('approved', 'pending')
                GROUP BY user_id
            ) p_decremented ON p_decremented.user_id = u.id
            LEFT JOIN (
                -- Quota spesa di gift card parzialmente usate poi cancellate.
                -- Per ogni debit cancelled, sottraggo la credit yes di rimborso
                -- corrispondente. La differenza e cio che l utente ha effettivamente
                -- speso prima della cancellation (legittimamente decrementato dal wallet).
                SELECT debit.user_id,
                    ROUND(SUM(debit.payable_amount - IFNULL(credit.amount, 0)), 2) AS spent
                FROM commission debit
                LEFT JOIN (
                    SELECT user_id, payable_amount AS amount, note
                    FROM commission
                    WHERE payment_type = 'gift_card_conversion'
                      AND type = 'credit' AND payment_status = 'yes'
                ) credit ON credit.user_id = debit.user_id
                          AND credit.note LIKE CONCAT('%#', debit.id, '%')
                WHERE debit.payment_type = 'gift_card_conversion'
                  AND debit.type = 'debit' AND debit.payment_status = 'cancelled'
                GROUP BY debit.user_id
            ) gc_spent ON gc_spent.user_id = u.id
            WHERE u.is_super_admin = 0
              AND ABS(ROUND(ub.balance - (IFNULL(c_net.total, 0) - IFNULL(p_decremented.total, 0) - IFNULL(gc_spent.spent, 0)), 2)) > 1
            ORDER BY ABS(ROUND(ub.balance - (IFNULL(c_net.total, 0) - IFNULL(p_decremented.total, 0) - IFNULL(gc_spent.spent, 0)), 2)) DESC
            LIMIT 20
        \");"""

if OLD not in content:
    print("ERROR: target not found")
    sys.exit(1)

content = content.replace(OLD, NEW)
with open(path, 'w') as f:
    f.write(content)
print("OK Check H now considers gift card spent quota")

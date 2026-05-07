#!/usr/bin/env python3
"""
Rimuove di fatto il limite BFS in ReportsController: 9 -> 100 (safety
net per evitare loop infiniti con dati corrotti, ma impossibile da
raggiungere in produzione - MLM piu' profondi al mondo arrivano a 30).
"""
import sys

path = '/home/forge/api.myevea.com/current/app/Http/Controllers/ReportsController.php'
with open(path, 'r') as f:
    src = f.read()

replacements = [
    # Pattern 1: for ($i = 0; $i < N && $currentLevel...
    ('for ($i = 0; $i < 9 && $currentLevel->isNotEmpty(); $i++) {',
     'for ($i = 0; $i < 100 && $currentLevel->isNotEmpty(); $i++) {'),
    ('for ($i = 0; $i < 15 && $currentLevel->isNotEmpty(); $i++) {',
     'for ($i = 0; $i < 100 && $currentLevel->isNotEmpty(); $i++) {'),
    # Pattern 2: for ($lvl = 0; $lvl < N && $curLevel...
    ('for ($lvl = 0; $lvl < 9 && $curLevel->isNotEmpty(); $lvl++) {',
     'for ($lvl = 0; $lvl < 100 && $curLevel->isNotEmpty(); $lvl++) {'),
    ('for ($lvl = 0; $lvl < 15 && $curLevel->isNotEmpty(); $lvl++) {',
     'for ($lvl = 0; $lvl < 100 && $curLevel->isNotEmpty(); $lvl++) {'),
    # Pattern 3: while ($currentLevel->isNotEmpty() && $level < N)
    ('while ($currentLevel->isNotEmpty() && $level < 9) {',
     'while ($currentLevel->isNotEmpty() && $level < 100) {'),
    ('while ($currentLevel->isNotEmpty() && $level < 15) {',
     'while ($currentLevel->isNotEmpty() && $level < 100) {'),
]

count = 0
for old, new in replacements:
    n = src.count(old)
    if n > 0:
        src = src.replace(old, new)
        count += n

if count == 0:
    print("ERROR no anchors found")
    sys.exit(1)

with open(path, 'w') as f:
    f.write(src)
print(f"OK replaced {count} BFS depth limits to 100")

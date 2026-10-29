"""Make disposable compiled-module variants; never edit production source."""
from pathlib import Path
import shutil

source = Path('.test-build')
for name in ['sustain', 'comfort', 'combined', 'candidate']:
    dest = Path('/tmp') / f'early-balance-{name}'
    shutil.copytree(source, dest, dirs_exist_ok=True)
    # Node needs ESM scope for copied compiler output.
    (dest / 'package.json').write_text('{"type":"module"}')
    config = dest / 'config/balance.js'
    combat = dest / 'combat.js'
    b, c = config.read_text(), combat.read_text()
    if name in ['sustain', 'combined']:
        for old, new in [('healBudget: 8', 'healBudget: 16'), ('bloodBudget: 6', 'bloodBudget: 12'),
                         ('reclaimerHeal: 3', 'reclaimerHeal: 4'), ('parasiticHeal: 2', 'parasiticHeal: 3'),
                         ('bloodHeal: 2', 'bloodHeal: 3')]:
            assert old in b, old
            b = b.replace(old, new)
    if name in ['comfort', 'combined']:
        # Preserve enemy damage/Boss/spawn/dash charges and invulnerability duration.
        assert 'dashRecharge: 2.8' in c
        c = c.replace('dashRecharge: 2.8', 'dashRecharge: 2.2')
        assert 'this.invulnerable = 0.65;' in c
        c = c.replace('this.invulnerable = 0.65;', 'this.invulnerable = 0.8;')
        assert 'oathDashMultiplier: 1.3' in b
        b = b.replace('oathDashMultiplier: 1.3', 'oathDashMultiplier: 1.15')
    if name == 'candidate':
        replacements = [('healBudget: 8', 'healBudget: 12'), ('bloodBudget: 6', 'bloodBudget: 9'),
                        ('reclaimerHeal: 3', 'reclaimerHeal: 4'), ('parasiticHeal: 2', 'parasiticHeal: 3'),
                        ('bloodHeal: 2', 'bloodHeal: 3'), ('cooldown: 7, damage: 6', 'cooldown: 7, damage: 5'),
                        ('oathDashMultiplier: 1.3', 'oathDashMultiplier: 1.15')]
        for old, new in replacements:
            assert old in b, old
            b = b.replace(old, new)
        for old, new in [('dashRecharge: 2.8', 'dashRecharge: 2.2'),
                         ('16 * enemy.damageScale', '12 * enemy.damageScale'),
                         ('10 * enemy.damageScale', '8 * enemy.damageScale'),
                         ("? 22 : 12)", "? 22 : 9)")]:
            assert old in c, old
            c = c.replace(old, new)
    config.write_text(b)
    combat.write_text(c)

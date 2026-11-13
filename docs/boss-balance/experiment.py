"""Compile and tune disposable modules only; never change src or deploy."""
from pathlib import Path
import hashlib
import io
import json
import shutil
import subprocess
import tempfile
import tarfile

repo = Path(__file__).resolve().parents[2]
out = repo / 'docs/boss-balance/evidence'
out.mkdir(parents=True, exist_ok=True)
sources = sorted((repo / 'src').rglob('*'))
def source_hash():
    return hashlib.sha256(b''.join(p.relative_to(repo).as_posix().encode() + p.read_bytes()
                                  for p in sources if p.is_file())).hexdigest()

before = source_hash()
baseline_revision = '78bc558782f45b957f8663202b69326182ad93cb'
with tempfile.TemporaryDirectory(prefix='boss-balance-') as directory:
    snapshot = Path(directory) / 'source'
    snapshot.mkdir()
    archived = subprocess.check_output(['git', 'archive', baseline_revision, 'src',
                                        'tests/boss-phase.test.mjs'], cwd=repo)
    with tarfile.open(fileobj=io.BytesIO(archived)) as archive:
        archive.extractall(snapshot, filter='data')
    base = Path(directory) / 'baseline'
    subprocess.run(['node', str(repo / 'node_modules/typescript/bin/tsc'), 'src/harnessAutoplay.ts',
                    'src/game/run.ts', 'src/game/progression.ts', 'src/game/config/playtests.ts',
                    '--target', 'ES2022', '--module', 'ES2022',
                    '--moduleResolution', 'bundler', '--strict', '--skipLibCheck',
                    '--outDir', str(base)], cwd=snapshot, check=True)
    (base / 'package.json').write_text('{"type":"module"}')
    autoplay = base / 'harnessAutoplay.js'
    emitted = autoplay.read_text()
    assert "'./game/movement'" in emitted
    autoplay.write_text(emitted.replace("'./game/movement'", "'./game/movement.js'"))
    focused = base / 'boss-phase.test.mjs'
    focused.write_text((snapshot / 'tests/boss-phase.test.mjs').read_text().replace('../.test-build/', './game/'))
    checks = subprocess.run(['node', '--test', str(focused)], cwd=repo, text=True,
                            stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    (out / 'baseline-tests.txt').write_text(checks.stdout)
    if checks.returncode:
        raise RuntimeError(checks.stdout)
    damage = {'sweep': 32, 'slam': 36, 'projectile': 14}
    tempo = {'enragedWindup': .8, 'enragedRecovery': .48, 'enragedCooldown': .65}
    phase = {'speedMultiplier': 1.05, 'followupGap': .45, 'followupWindup': .8, 'comboRecovery': 1.05}
    for name in ['baseline', 'damage', 'tempo', 'candidate', 'moderate']:
        dest = Path(directory) / name
        if name != 'baseline':
            shutil.copytree(base, dest)
        config = dest / 'game/config/balance.js'
        # Modify exported objects at module initialization in this disposable copy.
        extra = []
        if name in ['damage', 'candidate']:
            extra.append(f'Object.assign(BOSS_DAMAGE, {json.dumps(damage)});')
        if name in ['tempo', 'candidate']:
            extra.extend([f'Object.assign(BOSS_ATTACK, {json.dumps(tempo)});',
                          f'Object.assign(BOSS_PHASE, {json.dumps(phase)});'])
        if name == 'moderate':
            extra.extend(['Object.assign(BOSS_DAMAGE, {"sweep":38,"slam":40,"projectile":16});',
                          f'Object.assign(BOSS_ATTACK, {json.dumps(tempo)});',
                          f'Object.assign(BOSS_PHASE, {json.dumps(phase)});'])
        config.write_text(config.read_text() + '\n' + '\n'.join(extra))
        subprocess.run(['node', str(repo / 'docs/boss-balance/measure.mjs'), str(dest),
                        str(out / f'{name}.json')], cwd=repo, check=True)
assert before == source_hash(), 'Production source changed during experiment'
(out / 'provenance.json').write_text(json.dumps({
    'revision': baseline_revision,
    'sourceSha256BeforeAndAfter': before, 'productionSourceUnchanged': True,
    'damage': damage, 'tempo': tempo, 'phase': phase,
    'moderateDamage': {'sweep': 38, 'slam': 40, 'projectile': 16},
}, indent=2) + '\n')

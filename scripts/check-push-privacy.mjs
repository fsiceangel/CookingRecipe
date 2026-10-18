import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

// Inspect the entire outgoing history, not just its latest snapshot.
const updates = readFileSync(0, 'utf8').trim().split(/\r?\n/).filter(Boolean);
for (const update of updates) {
  const [, sha] = update.split(/\s+/);
  if (/^0+$/.test(sha)) continue;
  if (!/^[a-f0-9]{40,64}$/.test(sha)) throw new Error('Invalid outgoing Git object');
  const objects = execFileSync('git', ['rev-list', '--objects', sha], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const unsafe = objects.split('\n').filter(line => /(?:content|data\/recipes)\/private\/|(?:evelyn|jemerson)[^\n]*\.json/i.test(line));
  if (unsafe.length) {
    console.error('Push blocked: outgoing history contains private recipe files. Apply public changes onto the cleaned remote history before pushing.');
    process.exit(1);
  }
}

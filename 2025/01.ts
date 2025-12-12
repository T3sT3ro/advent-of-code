import $ from '@aoc/util/in';
import { sum, windowed } from 'es-toolkit';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/01').textContent.trim()
    .split('\n');

const d = t.map(tx => [tx[0], tx.slice(1)])
    .map(([dir, num]) => (dir == 'L' ? -1 : 1) * +num);

const SIZE = 100;
let pos = 50;
let [atZero, throughZero] = [0, 0];

for (const delta of d) {
    let deltaReminder = delta % SIZE;
    const newPos = pos + deltaReminder;
    throughZero += Math.floor(Math.abs(delta) / SIZE);
    if (pos != 0 && (newPos >= SIZE || newPos <= 0))
        ++throughZero;
    pos = (newPos + SIZE) % SIZE;
    if (pos == 0)
        ++atZero;
}

console.log(atZero, throughZero);
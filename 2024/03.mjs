import $ from '../util/src/in.js';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/03').textContent.trim()
    .split('\n');

const a1 = t.map(s => s
    .matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)
    .map(m => +m[1] * +m[2])
    .reduce((a, x) => a + x)
);

console.log(_.sum(a1));

let [multiplier, a2] = [1, 0];
for(const m of t.flatMap(s => [...s.matchAll(/(?<i>mul\((?<a>\d{1,3}),(?<b>\d{1,3})\)|do\(\)|don't\(\))/g)])) {
    if (m.groups.i.startsWith('mul')) {
        a2 += multiplier * +m.groups.a * +m.groups.b;
    } else if (m.groups.i.startsWith('don\'t')) {
        multiplier = 0;
    } else {
        multiplier = 1;
    }
}

console.log(a2);
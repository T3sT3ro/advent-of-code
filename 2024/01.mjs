import $ from '../util/src/in.js';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/01').textContent.trim()
    .split('\n');

const d = _(t)
    .map(x => x.split(/\s+/).map(x => +x));

const a1 = d
    .unzip()
    .map(xs => xs.toSorted())
    .unzip()
    .map(([a, b]) => Math.abs(a - b))
    .sum();

console.log(a1);

const counts = d.countBy(1).value();

const a2 = d.map(([a, _]) => a*(counts[a] || 0)).sum();

console.log(a2);

debugger;
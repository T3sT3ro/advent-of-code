import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/02').textContent.trim()
    .split('\n').map(xs => xs.split(/\s+/).map(x => +x));

let [a1, a2] = [0, 0];

function isProblematic(xs) {
    let D = xs.slice(1).map((x, i) => x - xs[i]) // to differences
    for (let i = 0; i < D.length; i++) {
        let d = D[i];
        if (Math.abs(d) < 1 || Math.abs(d) > 3 || i >= 1 && d * D[i - 1] <= 0)
            return true;
    }
    return false;
}

for (const xs of t) {
    if (!isProblematic(xs)) a1++;

    for (let i = 0; i < xs.length; i++) // fuck it, run in quadratic, this is too messy to implement otherwise
        if(!isProblematic(xs.toSpliced(i, 1))) {
            a2++;
            break;
        }
}

console.log(a1);
console.log(a2);
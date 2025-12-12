import $ from '@aoc/util/in';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/02').textContent.trim()
    .split(',')
    .map(s => s.match(/(\d+)-(\d+)/)!.slice(1).map(Number));

// numbers of form x=a*(10^(2k+1)+1)
// let answer1 = 0;
// for (const [lower, upper] of t) {
//     const log10_lower = Math.floor(Math.log10(lower-1));
//     const log10_upper = Math.floor(Math.log10(upper));
//     let [n1, n2] = [0,0]
//     for(let l = log10_lower + (log10_lower % 2 === 0 ? 1 : 0); l <= log10_upper; l+=2) {
//         n1 += Math.floor((lower - 1) / (10 ** l + 1));
//         n2 += Math.floor(upper / (10 ** l + 1));
//     }
//     answer1 += n2 - n1;
// }

let [a1, a2] = [0, 0];
for (const [l, u] of t) {
    for (let i = l; i <= u; i++) {
        const s = i.toString();
        if (s.match(/^(\d+)\1$/))
            a1 += i;
        if (s.match(/^(\d+)\1+$/))
            a2 += i;
    }
}

console.log(a1, a2);

import $ from '../in.mjs';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/03').textContent.trim().split('\n');

const banks = t.map(bank => bank.split('').map(Number));

let [totalJolt2, totalJolt12] = [0, 0];
for (const bank of banks) {
    let [max2, max12] = [-1, -1];
    let prev = new Array(bank.length).fill(0);

    for (let l = 1; l <= 12; l++) {
        const next = new Array(bank.length).fill(0);
        for (let i = l - 1; i < bank.length; i++) {
            const extended = (prev[i - 1] || 0) * 10 + bank[i];
            next[i] = Math.max (extended, next[i - 1] || 0);
        }
        prev = next;
        if (l == 2)
            max2 = Math.max(...next);
        if (l == 12)
            max12 = Math.max(...next);
    }
    // console.debug(bank, max2, max12);
    totalJolt2 += max2;
    totalJolt12 += max12;
}

console.log(totalJolt2, totalJolt12);

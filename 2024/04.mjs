import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/04').textContent.trim()
    .split('\n');

const BS = 4;

const MASKS = {
    X: 0b0001,
    M: 0b0010,
    A: 0b0100,
    S: 0b1000,
}

const valid_xmas = {
    [(MASKS.X << BS * 3) | (MASKS.M << BS * 2) | (MASKS.A << BS * 1) | (MASKS.S << BS * 0)]: true,
    [(MASKS.S << BS * 3) | (MASKS.A << BS * 2) | (MASKS.M << BS * 1) | (MASKS.X << BS * 0)]: true,
}

const valid_mas = {
    [(MASKS.M << BS * 2) | (MASKS.A << BS * 1) | (MASKS.S << BS * 0)]: true,
    [(MASKS.S << BS * 2) | (MASKS.A << BS * 1) | (MASKS.M << BS * 0)]: true,
}

function makeMask(e1, e2, e3, e4, details = {}) {
    return { m: (MASKS[e1] << BS * 3) | (MASKS[e2] << BS * 2) | (MASKS[e3] << BS * 1) | (MASKS[e4] << BS * 0), ...details };
}

let [a1, a2] = [0, 0];
for (let r = 0; r < t.length; r++) {
    for (let c = 0; c < t[r].length; c++) {
        // masks for 4 characters on row, column and two diagonals
        let r4 = makeMask(t[r + 0]?.[c + 0], t[r + 0]?.[c + 1], t[r + 0]?.[c + 2], t[r + 0]?.[c + 3], { d: 'xmas_r' });
        let c4 = makeMask(t[r + 0]?.[c + 0], t[r + 1]?.[c + 0], t[r + 2]?.[c + 0], t[r + 3]?.[c + 0], { c: 'xmas_c' });
        let d4_1 = makeMask(t[r + 0]?.[c + 0], t[r + 1]?.[c + 1], t[r + 2]?.[c + 2], t[r + 3]?.[c + 3], { d: 'xmas_d1' });
        let d4_2 = makeMask(t[r + 0]?.[c + 3], t[r + 1]?.[c + 2], t[r + 2]?.[c + 1], t[r + 3]?.[c + 0], { d: 'xmas_d2' });

        // masks for 3 characters on diagonals
        let d3_1 = makeMask(0, t[r + 0]?.[c + 0], t[r + 1]?.[c + 1], t[r + 2]?.[c + 2]);
        let d3_2 = makeMask(0, t[r + 0]?.[c + 2], t[r + 1]?.[c + 1], t[r + 2]?.[c + 0]);

        for (const mask of [r4, c4, d4_1, d4_2]) {
            if (valid_xmas[mask.m]) {
                /* console.log(
                    r, c,
                    mask.m.toString(2, 4).padStart(16, 0).replaceAll(/(....)(?=.)/g, '$1-'),
                    mask.m.toString(16), _.omit(mask, 'm')
                ); */
                a1++;
            }
        }

        if(valid_mas[d3_1.m] && valid_mas[d3_2.m])
            a2++;
    }
}

console.log(a1);
console.log(a2);

import $ from '@aoc/util/in';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
import { DIRECTIONS, map2D, neighbors2D } from '@aoc/util/util';
// --- browser devtools cutoff ---
const t = $('IN/04').textContent.trim().split('\n');

function removeRolls(t: string[][]): [string[][], number] {
    let removed = 0;
    let d = map2D(t, (e, rc) => {
        if (e != '@') return e;

        let neighbors = 0;
        for (const { rc: nrc } of neighbors2D(rc, DIRECTIONS))
            neighbors += (t[nrc[0]]?.[nrc[1]] === '@' ? 1 : 0);

        if (neighbors < 4) {
            ++removed;
            return '.';
        }
        return '@';
    });
    return [d, removed];
}

let [d, removed] = removeRolls(t);
let totalRemoved = removed;
console.log(removed);
while (removed > 0) {
    [d, removed] = removeRolls(d);
    totalRemoved += removed;
}
console.log(totalRemoved);

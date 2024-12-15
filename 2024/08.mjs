import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
import { iter2D, map2D } from '../util/src/util.mjs';
// --- browser devtools cutoff ---
const t = $('IN/08').textContent.trim()
    .split('\n');

const ants = _([...iter2D(t)])
    .filter(({ e }) => e.match(/[0-9a-zA-Z]/))
    .groupBy(({ e }) => e)
    .mapValues(ex => ex.map(({ rc }) => rc))
    .value();

/** @type {{[rc: string]: boolean}} */
const locations = {};
/** @type {{[rc: string]: boolean}} */
const locations2 = {};

for (const [freq, rcx] of Object.entries(ants)) {
    for (let i = 0; i < rcx.length - 1; i++) {
        for (let j = i + 1; j < rcx.length; j++) {
            const [x1, y1] = rcx[i];
            const [x2, y2] = rcx[j];
            let delta = [x2 - x1, y2 - y1];

            function* nextDir(rc, dir, k) {
                while (inBounds(rc)) {
                    yield { rc: rc, dir: dir, k: k};
                    rc = [rc[0] + dir[0], rc[1] + dir[1]];
                    ++k;
                }
            }

            for (const {rc, dir, k} of [...nextDir(rcx[i], delta, 0), ...nextDir(rcx[j], delta.map(x => -x), 0)]){
                if(k==2) locations[rc] = true;
                locations2[rc] = true;
            }
        }
    }
}

function inBounds([r, c]) { return r >= 0 && r < t.length && c >= 0 && c < t[0].length; }

console.log(Object.keys(locations).length);
console.log(Object.keys(locations2).length);
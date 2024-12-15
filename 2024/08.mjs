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

/** @type {{[K in keyof ants]: [number, number][]}} */
const antinodes = {};
/** @type {{[rc: string]: [keyof ants][]}} */
const locations = {};
for (const [freq, rcx] of Object.entries(ants)) {
    antinodes[freq] = [];
    for (let i = 0; i < rcx.length - 1; i++) {
        for (let j = i + 1; j < rcx.length; j++) {
            const [x1, y1] = rcx[i];
            const [x2, y2] = rcx[j];
            let delta = [x2 - x1, y2 - y1];
            const a1 = [x2 + delta[0], y2 + delta[1]];
            const a2 = [x1 - delta[0], y1 - delta[1]];
            if (inBounds(a1)) {
                locations[a1] = [...(locations[a1] || []), freq];
                antinodes[freq].push(a1);
            }

            if (inBounds(a2)) {
                locations[a2] = [...(locations[a2] || []), freq];
                antinodes[freq].push(a2);
            }
            // reference: https://pl.wikipedia.org/wiki/Prosta
            // const A = y2 - y1;
            // const B = x1 - x2;
            // const C = x2 * y1 - x1 * y2;
        }
    }
}

function inBounds([r, c]) { return r >= 0 && r < t.length && c >= 0 && c < t[0].length; }

console.log(_.uniq(Object.values(antinodes).flat().filter(inBounds).map(rc => rc.toString())));
console.log(Object.keys(locations).length);
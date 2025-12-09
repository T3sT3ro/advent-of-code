import $ from '../in.mjs';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/07').textContent.trim().split('\n')
    .map(line => line.split(''));

function rewrite(previous: string[], current: string[], timelines: number[]) {
    let splits = 0;
    for (let c = 0; c < current.length; c++) {
        if (previous[c] === 'S') {
            current[c] = '|';
            timelines[c] = 1;
        } else if (previous[c] === '|' && current[c] === '.') {
            current[c] = '|';
        } else if (previous[c] === '|' && current[c] === '^') {
            ++splits;
            current[c - 1] = current[c + 1] = '|';
            timelines[c - 1] += timelines[c];
            timelines[c + 1] += timelines[c];
            timelines[c] = 0;
        }
    }
    return splits;
}

let [prev, splits] = [t.shift()!, 0];
let timelines = prev.map(c => (c === 'S' ? 1 : 0));
for (const current of t.map(line => line.slice())) {
    splits += rewrite(prev, current, timelines);
    console.debug(current.join(''))
    console.warn(timelines.join(' '));
    prev = current;
}

console.log(splits);
console.log(timelines.reduce((a, b) => a + b, 0));


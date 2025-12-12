import $ from '@aoc/util/in';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/05').textContent.trim().split('\n\n');

const ranges = t[0].split('\n').map(r => r.split('-').map(Number));
const ids = t[1].split('\n').map(Number);

type event = { time: number, type: 'start' | 'end' | 'point' };

let events: event[] = ids.map(id => ({ time: id, type: 'point' }));
for (const [s, e] of ranges) {
    events.push({ time: s, type: 'start' });
    events.push({ time: e + 1, type: 'end' });
}
const eventToOrder = { 'start': 0, 'point': 1, 'end': 2 };
events.sort((a, b) => a.time - b.time || eventToOrder[a.type] - eventToOrder[b.type]);

const rangeDelta = { 'start': 1, 'end': -1, 'point': 0 };

let total = 0
let fresh = 0;
let start = 0;
let currentRanges = 0;
for (const e of events) {
    currentRanges += rangeDelta[e.type];
    if (e.type === 'point' && currentRanges > 0) {
        ++fresh;
    } else if (e.type === 'start' && currentRanges === 1) {
        start = e.time;
    } else if(e.type === 'end' && currentRanges === 0) {
        total += e.time - start;
    }
}

console.log(fresh, total);
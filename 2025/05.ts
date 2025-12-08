import $ from '../in.mjs';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/05').textContent.trim().split('\n\n');

const ranges = t[0].split('\n').map(r => r.split('-').map(Number));
const ids = t[1].split('\n').map(Number);

let a1 = 0;
nextId:
for (const id of ids) {
    for (const [s, e] of ranges) {
        if (s <= id && id <= e) {
            a1++;
            continue nextId;
        }
    }
}

console.log(a1);

let events = [];
for (const [s, e] of ranges) {
    events.push({ time: s, type: 'start' });
    events.push({ time: e + 1, type: 'end' });
}

events.sort((a, b) => a.time - b.time || (a.type === 'start' ? -1 : 1));

let total = 0
let lastStart = events.shift()!;
let currentRanges = 1;
for (const e of events) {
    if(currentRanges === 0) 
        lastStart = e;
    currentRanges += (e.type === 'start' ? 1 : -1);
    if (currentRanges === 0)
        total += e.time - lastStart.time;
}

console.log(total);
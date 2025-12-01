import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const [order, requests] = $('IN/05').textContent.trim()
    .split('\n\n');

let G = {};
for (const [before, after] of order.split('\n').map(r => r.split('|').map(x => +x))) {
    // @ts-ignore
    G[before] = Object.assign(G[before] || {}, { [after]: true });
}

let [a1, a2] = [0, 0];
for (const pages of requests.split('\n').map(r => r.split(',').map(x => +x))) {
    let valid = true;
    for (let i = 0; i < pages.length-1; i++) {
        for (let j = i+1; j < pages.length; j++) {
            let [p1, p2] = [pages[i], pages[j]];
            if(G[p2]?.[p1] == true){
                valid = false;
                [pages[i], pages[j]] = [pages[j], pages[i]];
            }
        }
    }
    if (valid)
        a1 += pages[pages.length >> 1];
    else 
        a2 += pages[pages.length >> 1];
}

console.log(a1);
console.log(a2);
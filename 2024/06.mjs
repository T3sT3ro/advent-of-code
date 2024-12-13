import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/06').textContent.trim()
    .split('\n');

import { find2D, iter2D, map2D } from '../util/src/util.mjs';

let guard = find2D(t, ({e, rc}) => e == '^').rc;
let walls = Object.fromEntries(iter2D(t).filter(({e}) => e == '#').map(({rc}) => [rc, true]));

const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
let dir = 0;

const seen = {};
function outOfBounds(rc) { return rc[0] < 0 || rc[0] >= t.length || rc[1] < 0 || rc[1] >= t[0].length; }

let state = [guard, dir];
while(!seen[state] && !outOfBounds(guard)) {
    seen[state] = true;
    while(walls[[guard[0]+dirs[dir][0], guard[1]+dirs[dir][1]]])
        dir = (dir+1)%4;

    guard = [guard[0]+dirs[dir][0], guard[1]+dirs[dir][1]];
    state = [guard, dir];
}

console.log(_.uniq(Object.keys(seen).map(k => k.split(',')).map(([r, c, dir]) => `${r},${c}`)).length);
import $ from '@aoc/util/in';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
import { range, sum, zip, zipWith } from 'es-toolkit';
import { multiply } from 'es-toolkit/compat';
var inputFile = 'IN/08';
// --- browser devtools cutoff ---
var inputFile = inputFile ?? 'html';
const points = $(inputFile).textContent.trim()
    .split('\n')
    .map(tx => tx.split(',').map(Number)) as Vec3[];

type Vec3 = [number, number, number];
/** Euclid distance squared between 3d vectors */
function distanceSquared(p1: Vec3, p2: Vec3) {
    return sum(zipWith(p1, p2, (a, b) => (a - b) ** 2));
}

type Edge = {d2: number, p1: number, p2: number };
const edges = range(0, points.length).flatMap(p1 =>
    range(p1 + 1, points.length).map(p2 =>
        ({ d2: distanceSquared(points[p1], points[p2]), p1, p2 })
    )
);

edges.sort((e1, e2) => e1.d2 - e2.d2);

// union find, <0 is root and abs = size, >0 is parent pointer
const UF = new Array(points.length).fill(-1);
function find(p: number, UF: number[]): number {
    if (UF[p] < 0)
        return p;
    UF[p] = find(UF[p], UF);
    return UF[p];
}
function union(p1: number, p2: number, UF: number[]): boolean {
    const r1 = find(p1, UF);
    const r2 = find(p2, UF);
    if (r1 === r2)
        return false;
    let [small, large] = UF[r1] > UF[r2] ? [r1, r2] : [r2, r1];
    UF[small] += UF[large];
    UF[large] = small;
    return true;
}

let components = points.length;
let steps = 0;
for (const e of edges){
    if(union(e.p1, e.p2, UF))
        --components;
    
    if(++steps == 1000) {
        const a1 = UF.toSorted((a, b) => a - b)
            .slice(0, 3)
            .reduce(multiply)
        console.log(Math.abs(a1));
    }

    if(components <= 1){
        console.log(points[e.p1][0]*points[e.p2][0]);
        break;
    }
}
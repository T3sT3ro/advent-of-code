import $ from '@aoc/util/in';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const t = $('IN/06').textContent.trim().split('\n');

const sum = (a: number, b: number) => a + b;
const mul = (a: number, b: number) => a * b;
const ops = t.pop()!.split(/\s+/)
    .map((o) => o === '+' ? sum : mul);

const rows = t.map(line =>
    [...line.matchAll(/\d+/g)]
        .map(Number)
);


const dimIndices = Array.from(Array(rows.length).keys());
const rowVectors = rows[0].map((_, c) =>
    dimIndices.map((_, r) => rows[r][c]));

function solveProblems(vectors: number[][], ops: ((a: number, b: number) => number)[]) {
    const problems = vectors.map((v, i) => v.reduce(ops[i]));
    return problems.reduce((a, b) => a + b, 0);
}


console.log(solveProblems(rowVectors, ops));

const columns = t[0].split('')
    .map((_, c) =>
        dimIndices.map((_, r) => t[r][c]).join('')
    );

let colVectors: number[][] = [[]];
for (const column of columns) {
    if (column.trim() === '') {
        colVectors.push([]);
    } else
        colVectors[colVectors.length - 1].push(+column);
}

console.log(solveProblems(colVectors, ops));
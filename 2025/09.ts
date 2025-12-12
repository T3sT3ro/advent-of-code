import $ from '@aoc/util/in';
import 'es-toolkit';
import 'core-js/actual/iterator/index.js';
import { writeFileSync } from 'node:fs';
import { maxBy, minBy } from 'es-toolkit';
import assert from 'node:assert';
// --- browser devtools cutoff ---
const inputFile = 'IN/09';
const points = $(globalThis.window ? 'html' : inputFile).textContent.trim().split('\n')
    .map(line => line.split(','))
    .map(([x, y]) => ({ x: +x, y: +y })) as Point[];

type Point = { x: number; y: number };

let maxArea = 0;
for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
        const p1 = points[i];
        const p2 = points[j];
        maxArea = Math.max(maxArea,
            Math.abs(p1.x - p2.x + 1) * Math.abs(p1.y - p2.y + 1));
    }
}

console.log(maxArea);

// The input data is in a specific shape requiring hand tailored solution

function dist(p1: Point, p2: Point) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

const minX = Math.min(...points.map(p => p.x));
const maxX = Math.max(...points.map(p => p.x));
const R = (maxX - minX) / 2;

// "notch" points which surely will be a part of the optimal rectangle
const upperCutoffId = points.keys().find(i => dist(points[i], points[(i + 1) % points.length]) > R)! + 1;
const lowerCutoffId = (upperCutoffId + 1) % points.length;
assert(points[lowerCutoffId].y < points[upperCutoffId].y);

// sort ascending
const rightCutoffX = points[lowerCutoffId].x;
const upperCutoffY = points[upperCutoffId].y;
const lowerCutoffY = points[lowerCutoffId].y;

// Work with indices instead of copying arrays

const rightBoundaryPointIndices = [...points.keys().filter(i => points[i].x >= rightCutoffX)];
const yBottomThresholdId = minBy(rightBoundaryPointIndices, i => points[i].y)!;
const yBottomThreshold = points[yBottomThresholdId].y;
const yTopThresholdId = maxBy(rightBoundaryPointIndices, i => points[i].y)!;
const yTopThreshold = points[yTopThresholdId].y;

const pointIndicesAfterCutoff = [...points.keys()].filter(i =>
    points[i].x < rightCutoffX
    && points[i].y >= yBottomThreshold && points[i].y <= yTopThreshold,
);

const upperArcIndices = pointIndicesAfterCutoff.filter(i => points[i].y >= upperCutoffY);
const lowerArcIndices = pointIndicesAfterCutoff.filter(i => points[i].y <= lowerCutoffY);
upperArcIndices.reverse(); // so that they both point "outward to the right"

function* getMonotonicArc(indices: number[]) {
    let minX = -Infinity;
    for (const i of indices) {
        if (points[i].x >= minX) {
            yield i;
            minX = points[i].x;
        }
    }
}

const monotonicUpperArc = [...getMonotonicArc(upperArcIndices)];
const monotonicLowerArc = [...getMonotonicArc(lowerArcIndices)];

function areaById(i: number, j: number) {
    return (Math.abs(points[i].x - points[j].x) + 1) * (Math.abs(points[i].y - points[j].y) + 1);
}

const bestUpperIndex = maxBy(monotonicUpperArc, i => areaById(i, upperCutoffId));
const bestLowerIndex = maxBy(monotonicLowerArc, i => areaById(i, lowerCutoffId));

const bestOverall = areaById(bestUpperIndex!, upperCutoffId) >= areaById(bestLowerIndex!, lowerCutoffId)
    ? bestUpperIndex
    : bestLowerIndex;

const bestArea = Math.max(
    areaById(bestUpperIndex!, upperCutoffId),
    areaById(bestLowerIndex!, lowerCutoffId),
);

console.log(bestArea);

writeFileSync('IN/09.svg', generateSvg(
    points,
    rightCutoffX,
    yTopThreshold,
    yBottomThreshold,
    upperCutoffId,
    lowerCutoffId,
    monotonicUpperArc,
    monotonicLowerArc,
    bestUpperIndex,
    bestLowerIndex,
    bestOverall!,
    bestArea,
));

// below is vibed code for visualization
function generateSvg(
    points: Point[], rightCutoffX: number, yTopThreshold: number, yBottomThreshold: number,
    upperCutoffId: number, lowerCutoffId: number, monotonicUpperArc: number[], monotonicLowerArc: number[],
    bestUpperIndex: number | undefined, bestLowerIndex: number | undefined, bestOverallIndex: number, bestArea: number,
) {
    if (points.length === 0) return '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"></svg>';

    const [minX, maxX] = [Math.min(...points.map(p => p.x)), Math.max(...points.map(p => p.x))];
    const [minY, maxY] = [Math.min(...points.map(p => p.y)), Math.max(...points.map(p => p.y))];
    const padding = 6000, size = Math.max(maxX - minX, maxY - minY) + padding * 2;
    const [offsetX, offsetY] = [minX - padding + (size - padding * 2 - (maxX - minX + 1)) / 2, minY - padding + (size - padding * 2 - (maxY - minY + 1)) / 2];
    const sw = size / 800, fs = sw * 1.5;
    const gradient = (t: number) => `rgb(${Math.round(255 * (1 - t))},0,${Math.round(139 * t)})`;
    const polyline = (indices: number[], stroke: string) => indices.length > 1 ? `<polyline points="${indices.map(i => `${points[i].x},${points[i].y}`).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${sw * 2}"/>` : '';
    const circle = (idx: number, fill: string, stroke: string) => `<circle cx="${points[idx].x}" cy="${points[idx].y}" r="${sw * 3}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    const line = (x1: number, y1: number, x2: number, y2: number, stroke: string) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw * 2}" stroke-dasharray="${sw * 5},${sw * 2}"/>`;

    const bestCutoffId = monotonicUpperArc.includes(bestOverallIndex) ? upperCutoffId : lowerCutoffId;
    const [rx, ry] = [Math.min(points[bestOverallIndex].x, points[bestCutoffId].x), Math.min(points[bestOverallIndex].y, points[bestCutoffId].y)];
    const [rw, rh] = [Math.abs(points[bestOverallIndex].x - points[bestCutoffId].x) + 1, Math.abs(points[bestOverallIndex].y - points[bestCutoffId].y) + 1];

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${offsetX} ${offsetY} ${size} ${size}" width="800" height="800">
<g transform="scale(1,-1) translate(0,${-(offsetY * 2 + size)})">
<polygon points="${points.map(p => `${p.x},${p.y}`).join(' ')}" fill="#4a90e2" stroke="none"/>
${points.map((p, i) => `<line x1="${p.x}" y1="${p.y}" x2="${points[(i + 1) % points.length].x}" y2="${points[(i + 1) % points.length].y}" stroke="${gradient(i / (points.length - 1))}" stroke-width="${sw}"/>`).join('')}
${line(rightCutoffX, minY, rightCutoffX, maxY, 'orange')}
${line(minX, yTopThreshold, maxX, yTopThreshold, 'hotpink')}
${line(minX, yBottomThreshold, maxX, yBottomThreshold, 'hotpink')}
<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="lime" fill-opacity="0.3" stroke="darkgreen" stroke-width="${sw * 2}"/>
${circle(upperCutoffId, 'red', 'darkred')}
${circle(lowerCutoffId, 'red', 'darkred')}
${polyline(monotonicUpperArc, 'green')}
${polyline(monotonicLowerArc, 'blue')}
${bestUpperIndex !== undefined ? circle(bestUpperIndex, 'lime', 'darkgreen') : ''}
${bestLowerIndex !== undefined ? circle(bestLowerIndex, 'cyan', 'darkblue') : ''}
</g>
<g transform="translate(0,${offsetY * 2 + size})">
<text x="${(points[bestOverallIndex].x + points[bestCutoffId].x) / 2}" y="${-(points[bestOverallIndex].y + points[bestCutoffId].y) / 2}" font-size="${fs * 2}" fill="darkgreen" font-family="monospace" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${bestArea}</text>
${points.map((p, i) => `<text x="${p.x + sw * 2}" y="${-(p.y + sw * 2) + (i % 2 ? fs : 0)}" font-size="${fs}" fill="black" font-family="monospace">${i}: (${p.x},${p.y})</text>`).join('')}
</g>
</svg>`;
}

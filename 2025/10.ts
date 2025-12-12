import $ from '@aoc/util/in';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
import { transpose } from '@aoc/util/matrix';
// --- browser devtools cutoff ---
const inputFile = 'IN/10';
const t = $(globalThis.window ? 'html' : inputFile).textContent.trim().split('\n');

type Diagram = {
    lights: string;
    lightMask: number;
    length: number;
    buttonMasks: number[];
    buttons: number[][];
    joltage: number[];
};

function parseManual(line: string): Diagram {
    const lights = line.match(/\[([.#]+)\]/)![1];
    const lightMask = parseInt(
        lights
            .split('')
            .map(c => c === '#' ? '1' : '0')
            .join(''),
        2);
    const length = lights.length;

    const buttons = [...line.matchAll(/\([\d,]+\)/g)
        .map(m => m[0]
            .substring(1, m[0].length - 1)
            .split(',')
            .map(Number)
        )];

    const buttonMasks = buttons.map(
        list => list.reduce(
            (mask, pos) => mask | (1 << (lights.length - 1 - pos)),
            0),
        0
    );

    const joltage = line.match(/\{([\d,]+)\}/)![1].split(',').map(Number);
    return {
        lights: lights,
        lightMask: lightMask,
        length: length,
        buttonMasks: buttonMasks,
        buttons: buttons,
        joltage: joltage
    };
}

const diagrams = t.map(parseManual);

// We basically need to solve a linear system in Z_2 using gauss elimination where
// Bx = L => B is button masks matrix with column being button mask, L is light mask column vector, x is solution vector
// ! it is harder due to free variables and #equation < #variables => multiple solutions possible, need to find one with minimal popcount
function findRepresentation(d: Diagram) {
    // transpose the masks, form adjoint matrix BL and perform elimination, then back substitute
    const M = transpose(...[...d.buttonMasks, d.lightMask]
        .map(m => m.toString(2)
            .padStart(d.length, '0')
            .split('')
        )
    ).map(row => parseInt(row.join(''), 2));
    // row permutation tracking
    const P = M.map((_, i) => i);
    for (let r = 0; r < M.length; r++) {
        // find biggest pivot (one with highest bit set)
        for (let p = r; p < M.length; p++) {
            if (M[p] > M[r]) {
                [M[r], M[p]] = [M[p], M[r]];
                [P[r], P[p]] = [P[p], P[r]];
            }
        }
        const highestBit = 1 << (31 - Math.clz32(M[r]));
        for (let i = r + 1; i < M.length; i++)
            if ((M[i] & highestBit) !== 0)
                M[i] ^= M[r];
    }

    // pop count of repr
    return NaN;
}

function bruteForceRepresentation(d: Diagram): number {
    function xorByMask(mask: number): number {
        let result = 0;
        let i = 0;
        while (mask > 0) {
            if (mask & 1)
                result ^= d.buttonMasks[i];
            i++;
            mask >>>= 1;
        }
        return result;
    }

    // iterate all masks with increasing popcount
    for (let k = 0; k <= d.buttonMasks.length; k++) {
        let mask = (1 << k) - 1; // initial mask with k bits set
        while (mask < (1 << d.buttonMasks.length)) {
            if (d.lightMask === xorByMask(mask))
                return k;
            if (mask == 0) break; // special case
            // Gosper's hack to get next mask with k bits set
            const c = mask & -mask;
            const r = mask + c;
            mask = (((r ^ mask) >>> 2) / c) | r;
        }
    }
    throw new Error('No representation found');
}

console.log(diagrams.map(d => bruteForceRepresentation(d)).reduce((a, b) => a + b, 0));

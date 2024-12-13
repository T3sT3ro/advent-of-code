import $ from '../in.mjs';
import _ from 'lodash';
import 'core-js/es/object/group-by.js';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
/** @type {[number, number[]][]} */
const t = $('IN/07').textContent.trim()
    .split('\n')
    .map(tx => tx.split(': '))
    .map(([test, numbers]) => [+test, numbers.split(' ').map(x => +x)]);

/**
 * 
 * @param {number} test 
 * @param {number[]} numbers 
 * @param {number} i 
 * @param {boolean} withConcat
 * @returns 
 */
function checkValidity(test, numbers, i, withConcat) {
    const last = numbers[i];
    if (i == 0 && last == test) return true;
    if (test % last == 0 && checkValidity(test / last, numbers, i - 1, withConcat)) return true;
    if (test - last >= 0 && checkValidity(test - last, numbers, i - 1, withConcat)) return true;
    if (withConcat && `${test}`.endsWith(`${last}`)
        && checkValidity(+`${test}`.slice(0, -`${last}`.length), numbers, i - 1, withConcat)
    ) return true;

    return false;
}

console.log(
    t.filter(([test, numbers]) =>
        checkValidity(test, numbers, numbers.length - 1, false)
    ).reduce((a, [test, numbers]) => a + test, 0)
);

console.log(
    t.filter(([test, numbers]) =>
        checkValidity(test, numbers, numbers.length - 1, true)
    ).reduce((a, [test, numbers]) => a + test, 0)
);
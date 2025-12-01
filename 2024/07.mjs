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
 * @param {[test: number, numbers: number[]]} param0 
 */
function checkValidity([test, numbers]) {

}

console.log(t.filter(checkValidity).reduce((a, [test, numbers]) => a + test))
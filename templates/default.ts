import $ from '@aoc/util/in';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
// --- browser devtools cutoff ---
const inputFile = 'IN/<<<DAY>>>';
const t = $(globalThis.window ? 'html' : inputFile).textContent.trim().split('\n');

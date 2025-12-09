import $ from '../in.mjs';
import 'es-toolkit';
// import _ from 'lodash';
import 'core-js/actual/iterator/index.js';
var inputFile = 'IN/<<<DAY>>>';
// --- browser devtools cutoff ---
var inputFile = inputFile ?? 'html';
const t = $(inputFile).textContent.trim().split('\n');

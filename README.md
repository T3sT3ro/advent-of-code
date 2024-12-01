# [Advent of Code](https://adventofcode.com/)

This is a collection of my solutions, helper scripts and inputs for Advent of Code.

There are some missing solutions, for example for 2015, because I've been using browser's debug console to write everything :)

There is a common idiom in all of my `.js` scripts, namely:

```js
$ = require('../in.js');
_ = require('lodash');
t = $('IN/0x').textContent.trim();
```

It's like that because I use JQuery on AoC site in the console to extract the text of input via `$('pre').textContent`, so this makes it easy to copy-paste code from/to browser and change only 2 lines in very simple way.

## Origin

This repo is an extract from my messy monorepo at [T3sT3ro.github.com](https://github.com/T3sT3ro/T3sT3ro.github.io) (public>algo>AoC).

I try to write in different languages and keep them collocated.
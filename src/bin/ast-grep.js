#!/usr/bin/env node
'use strict';

import fs from 'fs';
import mri from 'mri';
import globby from 'globby';
import getStream from 'get-stream';

import astGrep from '..';

const { _: [grepPattern, ...filePatterns], ...args } = mri(
  process.argv.slice(2)
);

async function run() {
  if (!grepPattern) {
    console.error('usage: ast-grep pattern [glob ...]');
    return 1;
  }
  if (filePatterns.length) {
    const files = globby.sync(filePatterns);
    if (!files.length) {
      console.error('ast-grep: no files matched input pattern(s)');
      return 1;
    }
    for (const file of files) {
      const matches = astGrep(fs.readFileSync(file, 'utf8'), {
        ...args,
        pattern: grepPattern,
      });
      displayMatches(matches, file);
    }
  } else {
    const text = await getStream(process.stdin);
    const matches = astGrep(text, {
      ...args,
      pattern: grepPattern,
    });
    displayMatches(matches);
  }

  return 0;
}

function displayMatches(matches /*, file */) {
  for (const match of matches) {
    console.log(match.text);
  }
}

run()
  .then(process.exit)
  .catch(error => {
    if (args.debug) {
      console.error(error);
    } else {
      console.error(`ast-grep: ${error.toString()}`);
    }
    process.exit(2);
  });

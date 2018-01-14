#!/usr/bin/env node
'use strict';

import fs from 'fs';
import yargs from 'yargs';
import globby from 'globby';
import getStream from 'get-stream';

import astGrep from '..';

yargs
  .option('anonymous', {
    alias: 'a',
    boolean: true,
    describe: 'Ignore all names in the AST',
  })
  .option('file', {
    alias: 'f',
    string: true,
    describe: 'Load pattern from a file',
  })
  .option('debug', { string: true, hidden: true })
  .help()
  .version()
  .example(
    `$0 -a 'fn()' file.js`,
    `Find all no-arg function calls in 'file.js'.`
  )
  .example(
    `$0 -f pattern.js '**/*.js'`,
    `Match the pattern in 'pattern.js' across all JS files.`
  )
  .example(`echo 'foo' | $0 'pattern'`, `Match 'pattern' on standard input.`);

async function run({ _: [grepPattern, ...filePatterns], ...args }) {
  if (!grepPattern && !args.file) {
    yargs.showHelp();
    return 2;
  }
  if (args.file && grepPattern) {
    filePatterns.unshift(grepPattern);
    grepPattern = fs.readFileSync(args.file, 'utf8');
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

function displayMatches(matches, file) {
  for (const match of matches) {
    if (file) {
      const lines = match.text.split(/\r?\n/);
      const startLine = match.node.loc ? match.node.loc.start.line : null;
      lines.forEach((line, i) => {
        console.log(`${file}:${startLine + i}:${line}`);
      });
    } else {
      console.log(match);
    }
  }
}

run(yargs.argv)
  .then(process.exit)
  .catch(error => {
    if (yargs.argv.debug) {
      console.error(error);
    } else {
      console.error(`ast-grep: ${error.toString()}`);
    }
    process.exit(2);
  });

import './polyfills';

import traverse from '@babel/traverse';
import omitDeep from 'omit-deep-lodash';
import deepEqual from 'deep-equal';

// import preprocess from './preprocess';
import parse from './parse';

export default (text, { pattern, anonymous }) => {
  const patternAsts = [].concat(getMeaningfulNode(parse(pattern)));
  const ast = parse(text);

  return patternAsts
    .flatMap(patternAst => matchAsts(patternAst, ast, { anonymous }))
    .map(match => {
      const code =
        readLineToStart(text, match.start) +
        text.substring(match.start, match.end) +
        readLineToEnd(text, match.end);
      return { text: code, node: match };
    });
};

const getMeaningfulNode = ast => {
  switch (ast.type) {
    case 'File':
      return getMeaningfulNode(ast.program);
    case 'Program':
      return ast.body.map(getMeaningfulNode);
    case 'ExpressionStatement':
      return getMeaningfulNode(ast.expression);
    default:
      return ast;
  }
};

const omitKeysDefault = ['start', 'end', 'loc'];

const matchAsts = (smaller, bigger, { anonymous }) => {
  const omitKeys = anonymous ? [...omitKeysDefault, 'name'] : omitKeysDefault;
  const matches = [];
  smaller = omitDeep(smaller, ...omitKeys);

  traverse(bigger, {
    enter(path) {
      if (deepEqual(omitDeep(path.node, ...omitKeys), smaller)) {
        matches.push(path.node);
      }
    },
  });

  return matches;
};

const readLineToStart = (text, index) => {
  const range = text.substring(0, index);
  const match = /\r?\n(.*)$/.exec(range);
  if (!match) {
    return '';
  }
  return match[1];
};

const readLineToEnd = (text, index) => {
  const range = text.substring(index);
  const match = /^(.*)\r?\n/.exec(range);
  if (!match) {
    return '';
  }
  return match[1];
};

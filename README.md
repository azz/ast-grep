# `ast-grep`

[![Travis](https://img.shields.io/travis/azz/ast-grep.svg?style=flat-square)](https://travis-ci.org/azz/ast-grep)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/ast-grep.svg?style=flat-square)](https://npmjs.org/ast-grep)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

> Like grep, but more powerful than you can possibly imagine.

Search your JavaScript files for patterns based on AST shape, rather than substrings or regular expressions.

## Install

With `yarn`:

```shellsession
yarn global add ast-grep
```

With `npm`:

```shellsession
npm install --global --save ast-grep
```

## Usage

On standard in:

```shellsession
$ echo 'code();' | ast-grep 'code'
code();
$ ast-grep 'foo()' < file.js
foo();
```

On a set of files:

```shellsession
$ ast-grep 'yield* foo();' '**/*.js'
```

## Flags

### `--anonymous`

**Alias**: `-a`

Ignore names, this includes identifiers, types, etc.

## Examples

### Find all no-arg function calls:

```shellsession
$ echo -e 'foo();\nbar();' | ast-grep 'fn()' -a
foo();
bar();
```

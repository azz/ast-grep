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
npm install --global ast-grep
```

## Usage

```shellsession
$ ast-grep --help
Options:
  --anonymous, -a  Ignore all names in the AST                         [boolean]
  --file, -f       Load pattern from a file                             [string]
  --help           Show help                                           [boolean]
  --version        Show version number                                 [boolean]

Examples:
  ast-grep.js -a 'fn()' file.js        Find all no-arg function calls in
                                       'file.js'.
  ast-grep.js -f pattern.js '**/*.js'  Match the pattern in 'pattern.js' across
                                       all JS files.
  echo 'foo' | ast-grep.js 'pattern'   Match 'pattern' on standard input.
```

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

## FAQ

### Q. But @azz, `grep` stands for Global Regular Expression Print, this tool doesn't use Regular Expressions!

**A.** I know, but `gastp` doesn't sound great.

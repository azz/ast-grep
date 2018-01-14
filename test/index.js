import { join, basename } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { codeFrameColumns } from '@babel/code-frame';

import astGrep from '../src';
import { raw } from './raw-serializer';

const SPLITTER = '~'.repeat(80) + '\n';

export default (directoryPath, pattern, args) => {
  describe(basename(directoryPath), () => {
    readdirSync(directoryPath).forEach(file => {
      if (/^[_.]/.test(file) || file.endsWith('.test.js')) {
        return;
      }

      test(file, () => {
        const input = readFileSync(join(directoryPath, file), 'utf8');
        const matches = astGrep(input, { pattern, ...args });

        const frames = matches
          .map(match => codeFrameColumns(input, match.node.loc) + '\n')
          .join(SPLITTER);
        const texts = matches.map(({ text }) => text + '\n').join(SPLITTER);

        expect(raw('\n' + texts)).toMatchSnapshot('raw');
        expect(raw(frames)).toMatchSnapshot('frames');
      });
    });
  });
};

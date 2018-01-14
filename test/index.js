import { join, basename } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { codeFrameColumns } from '@babel/code-frame';

import astGrep from '..';
import { raw } from './raw-serializer';

export default (directoryPath, pattern, args) => {
  describe(basename(directoryPath), () => {
    readdirSync(directoryPath).forEach(file => {
      if (/^[_.]/.test(file) || file.endsWith('.test.js')) {
        return;
      }

      test(file, () => {
        const input = readFileSync(join(directoryPath, file), 'utf8');
        const matches = astGrep(input, { ...args, pattern });
        const frames = matches
          .map(match => codeFrameColumns(input, match.node.loc))
          .join('~'.repeat(80));
        const texts = matches
          .map(({ text }) => text + '\n')
          .join('~'.repeat(80) + '\n');

        expect(raw('\n' + texts)).toMatchSnapshot('raw');
        expect(raw(frames)).toMatchSnapshot('frames');
      });
    });
  });
};

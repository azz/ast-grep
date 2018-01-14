import { join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { stripIndent } from 'common-tags';

if (!process.argv[2]) {
  console.error('usage: yarn test:generate name-of-test');
  process.exit(0);
}
const name = process.argv[2];
const dir = join(__dirname, name);

mkdirSync(dir);
writeFileSync(
  join(dir, 'grep.test.js'),
  stripIndent`
    import run from '..';

    run(__dirname, 'PATTERN_HERE');
  ` + '\n'
);
writeFileSync(join(dir, name + '.js'), 'CODE(HERE);\n');

import mem from 'mem';
import { parse, parseExpression } from 'babylon';
import { codeFrameColumns } from '@babel/code-frame';

export default mem((text, { filePath = null, isTypeScript = false } = {}) => {
  const options = {
    allowImportExportEverywhere: true,
    allowSuperOutsideMethod: true,
    sourceFilename: filePath,
    plugins: [
      'asyncGenerators',
      'classConstructorCall',
      'classProperties',
      'decorators2',
      'doExpressions',
      'dynamicImport',
      'exportExtensions',
      'functionBind',
      'functionSent',
      'jsx',
      'objectRestSpread',
      isTypeScript ? 'typescript' : 'flow',
    ],
  };

  try {
    return tryScriptAndModule(parse, text, options);
  } catch (error) {
    try {
      return tryScriptAndModule(parseExpression, text, options);
    } catch (error2) {
      throw new SyntaxError(
        codeFrameColumns(text, error.loc, { highightCode: true })
      );
    }
  }
});

const tryScriptAndModule = (fn, text, options) => {
  try {
    return fn(text, { ...options, sourceType: 'module' });
  } catch (error) {
    try {
      return fn(text, { ...options, sourceType: 'script' });
    } catch (error2) {
      throw error;
    }
  }
};

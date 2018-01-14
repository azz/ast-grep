export const ANY_IDENTIFIER = '__AST_GREP_ANY_IDENTIFIER__';

export default text => {
  const matches = [];
  const regex = /%(\w+)/g;

  let match;
  let output = text;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      length: match[0].length,
    });
    switch (match[1]) {
      case 'i':
        output =
          output.substring(0, match.index) +
          ANY_IDENTIFIER +
          output.substring(match.index + match[0].length);
    }
  }
  return output;
};

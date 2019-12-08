const csstree = require('css-tree');

module.exports = function(data) {
  if (!data) {
    throw new Error('1 argument required, but only 0 present.');
  }

  const ast = csstree.parse(data, {
    context: 'selector',
    onParseError: error => {
      console.log(error.formattedMessage);
    }
  });

  const nodes = [];
  csstree.walk(ast, node => {
    if (node.type === 'ClassSelector' || node.type === 'IdSelector') {
      nodes.push(node);
    }
  });
  return nodes;
};

import csstree from 'css-tree';
import { CSSSelectorString, SelectorForSearch } from '../../types';

export default function (data: CSSSelectorString) {
  if (!data) {
    throw new Error('1 argument required, but only 0 present.');
  }

  const ast = csstree.parse(data, {
    context: 'selector',
    onParseError: (error) => {
      console.log(error.message);
    },
  });

  let nodes: SelectorForSearch[] = [];

  csstree.walk(ast, (node) => {
    if (node.type === 'ClassSelector' || node.type === 'IdSelector') {
      nodes.push(node);
    }
  });

  return nodes;
}

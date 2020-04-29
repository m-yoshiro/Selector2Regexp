import csstree from 'css-tree';
import { CSSSelectorString, IdOrClassSelector } from '../../types';

export default function (selectorString: CSSSelectorString) {
  if (!selectorString) {
    throw new Error('1 argument required, but only 0 present.');
  }

  const ast = csstree.parse(selectorString, {
    context: 'selector',
    onParseError: (error) => {
      console.log(error.message);
    },
  });

  let nodes: (IdOrClassSelector | null)[] = [];

  csstree.walk(ast, (node) => {
    if (node.type === 'ClassSelector' || node.type === 'IdSelector') {
      nodes.push(node);
    }
  });

  return nodes.length > 0 ? (nodes as IdOrClassSelector[]) : null;
}

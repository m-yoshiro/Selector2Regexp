import csstree from 'css-tree';
import { CSSSelectorString, IdOrClassSelector } from '../../types';

export default (selectorString: CSSSelectorString) => {
  const ast = csstree.parse(selectorString, {
    context: 'selector',
    onParseError: (error) => {
      console.log(error.message);
    },
  });

  const nodes: (IdOrClassSelector | null)[] = [];

  csstree.walk(ast, (node) => {
    if (node.type === 'ClassSelector' || node.type === 'IdSelector') {
      nodes.push(node);
    }
  });

  return nodes.length > 0 ? nodes : null;
};

import csstree from 'css-tree';
import { CSSSelectorString } from '../../types';

export default (selectorString: CSSSelectorString) => {
  try {
    return csstree.parse(selectorString, {
      context: 'selector',
      onParseError: (error) => {
        console.log(error.message);
      },
    });
  } catch (error) {
    throw error;
  }

  // const nodes: (IdOrClassSelector | null)[] = [];

  // csstree.walk(ast, (node) => {
  //   if (node.type === 'ClassSelector' || node.type === 'IdSelector') {
  //     nodes.push(node);
  //   }
  // });
};

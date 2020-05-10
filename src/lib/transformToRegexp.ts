import csstree from 'css-tree';
import { visitor } from './visitor';
import { targetNode } from '../../types';

export default function (selector: csstree.Selector) {
  if (selector.type !== 'Selector') {
    throw new Error(`Bad node type ${selector.type} for 'generateRegexString'.`);
  }

  let list: targetNode[] = [];

  const createS2rList = (list: targetNode[]) => {
    // [1, 3, 4, 5, 6]
    return list.map((node, i, o) => {
      return {
        data: node,
        next: () => (o[i + 1] ? o[i + 1] : null),
        prev: () => (o[i - 1] ? o[i - 1] : null),
      };
    });
  };

  csstree.walk(selector, (node) => {
    switch (node.type) {
      case 'ClassSelector':
      case 'IdSelector':
      case 'TypeSelector':
      case 'WhiteSpace':
      case 'AttributeSelector':
      case 'Combinator':
      case 'PseudoElementSelector':
      case 'SelectorList':
        list.push(node);
        break;
      default:
        break;
    }
  });

  return createS2rList(list)
    .map((node) => visitor[node.data.type](node, list))
    .join('');
}

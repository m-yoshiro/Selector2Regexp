import csstree from 'css-tree';
import { visitor } from './visitor/visitor';
import { s2rNode, targetNode } from '../../types';

export function transformToRegexp(selector: csstree.Selector) {
  if (selector.type !== 'Selector') {
    throw new Error(`Bad node type ${selector.type} for 'generateRegexString'.`);
  }

  const list: targetNode[] = [];

  const createS2rList = (list: targetNode[]) => {
    const result: s2rNode<targetNode>[] = [];

    list.forEach((node, i) => {
      result.push({
        data: node,
        next: () => (result[i + 1] ? result[i + 1] : null),
        prev: () => (result[i - 1] ? result[i - 1] : null),
      });
    });

    return result;
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

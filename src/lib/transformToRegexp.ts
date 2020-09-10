import csstree from 'css-tree';
import { visitor } from './visitor/visitor';
import { s2rListItem, targetNode } from '../../types';

const isSelectorList = (selector: csstree.SelectorList | csstree.Selector) => selector.type === 'SelectorList' && selector.children.getSize() > 1;

export function transformToRegexp(selector: csstree.SelectorList | csstree.Selector) {
  // If selector is 'SelectorList' with more than two items, selector is identified as 'SelectorList'.
  selector = isSelectorList(selector) ? selector : (selector.children.first() as csstree.Selector);

  const list: targetNode[] = [];

  const createS2rList = (list: targetNode[]) => {
    const result: s2rListItem<targetNode>[] = [];

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

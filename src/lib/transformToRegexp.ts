import csstree from 'css-tree';
import { visitor } from './visitor/visitor';
import { s2rList,  targetNode, s2rListItem } from '../../types';

const isSelectorList = (selector: csstree.SelectorList | csstree.Selector) => selector.type === 'SelectorList' && selector.children.getSize() > 1;

const createS2rList = (list: targetNode[]): s2rList<targetNode> => {
  const result: s2rList<targetNode> = [];
  list.forEach((node, i) => {
    result.push({
      data: node,
      next: () => (result[i + 1] ? result[i + 1] : null),
      prev: () => (result[i - 1] ? result[i - 1] : null),
      value: '',
    });
  });

  return result;
};

export function transformToRegexp(selector: csstree.SelectorList | csstree.Selector) {
  // If selector is 'SelectorList' with more than two items, selector is identified as 'SelectorList'.
  selector = isSelectorList(selector) ? selector : (selector.children.first() as csstree.Selector);
  const list: targetNode[] = [];

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
    .map((listItem) => {
      listItem.value = visitor[listItem.data.type].enter(listItem, list);
      listItem.value = visitor[listItem.data.type].leave(listItem, list);
      return listItem.value;
    })
    .join('');
}

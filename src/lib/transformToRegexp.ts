import csstree from 'css-tree';
import { visitor, VisitorFunction } from './visitor/visitor';
import { s2rList, targetNode } from '../../types';

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

const noop = () => null;

export function transformToRegexp(selector: csstree.SelectorList | csstree.Selector) {
  // If selector is 'SelectorList' with more than two items, selector is identified as 'SelectorList'.
  selector = isSelectorList(selector) ? selector : (selector.children.first() as csstree.Selector);
  const list: targetNode[] = [];

  csstree.walk(selector, {
    enter(node: csstree.CssNode) {
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
    },
  });

  const result = createS2rList(list);
  result.forEach((listItem) => {
    const visitorFunc = visitor[listItem.data.type];

    let enter: VisitorFunction | typeof noop = noop;
    let leave: VisitorFunction | typeof noop = noop;

    if (typeof visitorFunc === 'function') {
      enter = visitorFunc;
    } else {
      enter = visitorFunc.enter || noop;
      leave = visitorFunc.leave || noop;
    }

    enter(listItem, list);
    leave(listItem, list);
  });

  return result.map((listItem) => listItem.value).join('');
}

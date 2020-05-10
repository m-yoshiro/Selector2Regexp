import csstree from 'css-tree';
import { visitor } from './visitor';

type targetNode = csstree.ClassSelector | csstree.IdSelector | csstree.TypeSelector | csstree.AttributeSelector | csstree.WhiteSpace | csstree.Combinator | csstree.PseudoElementSelector | csstree.SelectorList;

export default function (selector: csstree.Selector) {
  if (selector.type !== 'Selector') {
    throw new Error(`Bad node type ${selector.type} for 'generateRegexString'.`);
  }

  let list: targetNode[] = [];

  const createS2rList = (list: targetNode[]) => {
    return list.map((node, i, o) => {
      const next = o[i + 1];
      const prev = o[i - 1];

      return {
        data: node,
        next: next ? next : null,
        prev: prev ? prev : null,
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
    .map((node) => visitor[node.data.type](node))
    .join('');
}

import csstree from 'css-tree';
import { visitor } from './visitor';
import { s2rNode } from '../../types';

type targetNode = csstree.ClassSelector | csstree.IdSelector | csstree.TypeSelector | csstree.AttributeSelector | csstree.WhiteSpace | csstree.Combinator | csstree.PseudoElementSelector | csstree.SelectorList;

export default function (selector: csstree.Selector) {
  if (selector.type !== 'Selector') {
    throw new Error(`Bad node type ${selector.type} for 'generateRegexString'.`);
  }

  const result: s2rNode<targetNode>[] = [];
  const prev = (result: s2rNode<targetNode>[]) => (result.length > 0 ? result[result.length - 1] : null);

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
        result.push({
          type: node.type,
          data: node,
          prev: prev(result),
        });
        break;
      default:
        break;
    }
  });

  return result.map((node) => visitor[node.data.type](node)).join('');
}

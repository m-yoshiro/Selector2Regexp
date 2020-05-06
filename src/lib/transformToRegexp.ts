import csstree from 'css-tree';
import { visitor, Visitor } from './visitor';

export default function (selector: csstree.Selector) {
  if (selector.type !== 'Selector') {
    throw new Error(`Bad node type ${selector.type} for 'generateRegexString'.`);
  }

  const result: unknown[] = [];
  csstree.walk(selector, (node) => {
    // TODO: To be simple
    // if (node.type in visitor) {
    //   visitor[node.type](node);
    // }

    switch (node.type) {
      case 'ClassSelector':
        result.push(visitor[node.type](node));
        break;
      case 'IdSelector':
        result.push(visitor[node.type](node));
        break;
      case 'TypeSelector':
        result.push(visitor[node.type](node));
        break;
      case 'WhiteSpace':
        result.push(visitor[node.type](node));
        break;
      case 'AttributeSelector':
        result.push(visitor[node.type](node));
        break;
      case 'Combinator':
        result.push(visitor[node.type](node));
        break;
      case 'PseudoElementSelector':
        result.push(visitor[node.type](node));
        break;
      default:
        break;
    }
  });

  return result.join('');
}

import csstree from 'css-tree';
import { visitor, VisitorFunction } from './visitor/visitor';
import { targetNode, s2r } from '../../types';
import { showCompletionScript } from 'yargs';

const isSelectorList = (selector: csstree.SelectorList | csstree.Selector) => selector.type === 'SelectorList' && selector.children.getSize() > 1;

const SPECIFIC_COMBINATOR = {
  '>': 'ChildCombinator',
  '+': 'AdjacentSiblingCombinator',
  '~': 'GeneralSiblingCombinator',
} as const;

const classifyCombinator = (node: csstree.Combinator) => {
  if (node.type === 'Combinator' && node.name in SPECIFIC_COMBINATOR) {
    return SPECIFIC_COMBINATOR[node.name as keyof typeof SPECIFIC_COMBINATOR];
  } else {
    return 'Combinator';
  }
};

const createNode = (node: targetNode, i: number, context: s2r.NodeList<targetNode>): s2r.Node<targetNode> => {
  return {
    type: node.type,
    data: node,
    next: () => (context[i + 1] ? context[i + 1] : null),
    prev: () => (context[i - 1] ? context[i - 1] : null),
    value: '',
  };
};

const createS2rList = (list: targetNode[]): s2r.NodeList<targetNode> => {
  const context: s2r.NodeList<targetNode> = [];
  list.forEach((node, i) => {
    const nextNode = context[i + 1];
    const prevNode = context[i - 1];

    // When next node is a Combinator,
    // this node should create Group node and be contained Group node children.
    if (nextNode && nextNode.data.type === 'Combinator') {
      const CombinatorNode: s2r.Node<targetNode> = {
        type: classifyCombinator(nextNode.data),
        data: node,
        next: () => (context[i + 1] ? context[i + 1] : null),
        prev: () => (context[i - 1] ? context[i - 1] : null),
        value: '',
        children: [],
      };

      // Create child nodes.
      [node, list[i + 1], list[i + 2]].forEach((child, i) => {
        CombinatorNode.children && CombinatorNode.children.push(createNode(child, i, CombinatorNode.children));
      });

      context.push(CombinatorNode);
    } else {
      context.push(createNode(node, i, context));
    }
  });

  return context;
};

const noop = () => null;

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

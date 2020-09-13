import csstree from 'css-tree';

export interface CssSearchSelector {
  version: string;
}

export type CSSSelectorString = string;

export type IdOrClassSelector = csstree.ClassSelector | csstree.IdSelector;

export type SelectorRegexpString = string;

export type targetNode =
  | csstree.ClassSelector
  | csstree.IdSelector
  | csstree.TypeSelector
  | csstree.AttributeSelector
  | csstree.WhiteSpace
  | csstree.Combinator
  | csstree.PseudoElementSelector
  | csstree.SelectorList;

namespace s2r {
  type relationType = 'group' | 'single';
  export interface Node<N extends csstree.CssNode> {
    type: N['type'] | 'ChildCombinator' | 'AdjacentSiblingCombinator' | 'GeneralSiblingCombinator';
    data: N;
    next: () => s2r.Node<N> | null;
    prev: () => s2r.Node<N> | null;
    value: string;
    children?: s2r.NodeList<N>;
  }

  export type NodeList<N extends csstree.CssNode> = s2r.Node<N>[];
}

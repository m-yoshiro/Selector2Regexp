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
  export interface Node<N extends csstree.CssNode> {
    data: N;
    next: () => Node<N> | null;
    prev: () => Node<N> | null;
    value: string;
  }

  export type NodeList<N extends csstree.CssNode> = s2r.Node<N>[];
}

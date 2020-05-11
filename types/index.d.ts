import csstree from 'css-tree';

export interface CssSearchSelector {
  version: string;
}

export type CSSSelectorString = string;

export type IdOrClassSelector = csstree.ClassSelector | csstree.IdSelector;

export type targetNode = csstree.ClassSelector | csstree.IdSelector | csstree.TypeSelector | csstree.AttributeSelector | csstree.WhiteSpace | csstree.Combinator | csstree.PseudoElementSelector | csstree.SelectorList;

export type s2rNode<N extends csstree.CssNode> = {
  data: N;
  next: () => s2rNode<N> | null;
  prev: () => s2rNode<N> | null;
};

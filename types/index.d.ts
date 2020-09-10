import csstree from 'css-tree';

export interface CssSearchSelector {
  version: string;
}

export type CSSSelectorString = string;

export type IdOrClassSelector = csstree.ClassSelector | csstree.IdSelector;

export type targetNode =
  | csstree.ClassSelector
  | csstree.IdSelector
  | csstree.TypeSelector
  | csstree.AttributeSelector
  | csstree.WhiteSpace
  | csstree.Combinator
  | csstree.PseudoElementSelector
  | csstree.SelectorList;

export type s2rListItem<N extends csstree.CssNode> = {
  data: N;
  next: () => s2rListItem<N> | null;
  prev: () => s2rListItem<N> | null;
  value: string;
};

export type s2rList<N extends csstree.CssNode> = s2rListItem<N>[];

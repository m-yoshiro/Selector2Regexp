import csstree from 'css-tree';

export interface CssSearchSelector {
  version: string;
}

export type CSSSelectorString = string;

export type IdOrClassSelector = csstree.ClassSelector | csstree.IdSelector;

export type s2rNode<N extends csstree.CssNode, Prev extends csstree.CssNode> = {
  type: N['type'];
  data: N;
  prev: Prev | null;
};

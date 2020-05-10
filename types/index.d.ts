import csstree from 'css-tree';

export interface CssSearchSelector {
  version: string;
}

export type CSSSelectorString = string;

export type IdOrClassSelector = csstree.ClassSelector | csstree.IdSelector;

export type s2rNode<N extends csstree.CssNode> = {
  data: N;
  prev: s2rNode | null;
  prev: s2rNode | null;
};

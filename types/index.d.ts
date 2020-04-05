import csstree from 'css-tree';

export interface CssSearchSelector {
  version: string;
}

export type CSSSelectorString = string;

export type SelectorForSearch = csstree.ClassSelector | csstree.IdSelector;

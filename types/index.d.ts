import csstree from 'css-tree';
import { Combinator } from '../src/lib/node/combinator';
import { Element } from '../src/lib/node/element';
import { Selector } from '../src/lib/node/selector';

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

type Matcher = '=' | '*=' | '~=' | '^=' | '$=' | string | null;
export interface Attribute {
  name: string;
  value?: string | null;
  matcher?: Matcher;
}

interface S2rNode {
  tagName?: csstree.TypeSelector['name'];
  attributes?: Attribute[];
  parent?: S2rNode;
  child?: S2rNode;
}

export type Node = Selector | Element | Combinator;

import csstree, { PseudoElementSelector } from 'css-tree';
import { s2rNode } from '../../types';

const START_OF_BRACKET = '<\\s*';
const END_OF_BRACKET = '\\s*>';
const TYPE_NAME = '\\w+';
const CLASS_ATTRIBUTE = 'class';
const ANY_VALUE = '\\w*';
const ID_ATTRIBUTE = 'id';
const ATTRIBUTE_SEPARATOR = '\\s+';
const SPACE_BETWEEN_ELEMENT = '\\s*';
const QUOTE = '[\'"]';
const BEFORE_ATTRIBUTE = '(?<!\\w)'; // ES2018
const AFTER_ATTRIBUTE = '(?!\\w)';
const ANY_OPENING_TAG = '<.*>';
// const ANY_CONTENT = '<.*>';

type SelectorRegexpString = string;
type NoSupport = Error | void;

export type Visitor = {
  ClassSelector: (node: s2rNode<csstree.CssNode, csstree.CssNode>) => SelectorRegexpString;
  IdSelector: (node: s2rNode<csstree.CssNode, csstree.CssNode>) => SelectorRegexpString;
  AttributeSelector: (node: s2rNode<csstree.CssNode, csstree.CssNode>) => SelectorRegexpString;
  WhiteSpace: (node: s2rNode<csstree.CssNode, csstree.CssNode>) => SelectorRegexpString;
  TypeSelector: (node: s2rNode<csstree.CssNode, csstree.CssNode>) => SelectorRegexpString;
  Combinator: (node: s2rNode<csstree.CssNode, csstree.CssNode>) => NoSupport;
  PseudoElementSelector: (node: s2rNode<csstree.CssNode, csstree.CssNode>) => NoSupport;
  SelectorList: (node: s2rNode<csstree.CssNode, csstree.CssNode>) => NoSupport;
};

const attributeRegexp = <T extends string>(attribute: string, value: T | T[] | null) => {
  if (!value) {
    return `${attribute}`;
  }

  const valueRegexp = (value: T | T[]) => {
    const valueString = Array.isArray(value) ? value.join('|') : value;
    const n = Array.isArray(value) ? `{${value.length}}` : '';

    return `${ANY_VALUE}${SPACE_BETWEEN_ELEMENT}${BEFORE_ATTRIBUTE}(${valueString})${AFTER_ATTRIBUTE}${SPACE_BETWEEN_ELEMENT}${ANY_VALUE}${n}`;
  };

  return `${attribute}=${QUOTE}${valueRegexp(value)}${QUOTE}`;
};

const openingTagRegexp = (type: string, attribute?: string) => {
  return START_OF_BRACKET + `(${type})` + '\\s*.*?' + END_OF_BRACKET;
};

const closingTagRegexp = (type: string) => {
  return START_OF_BRACKET + '/' + type + END_OF_BRACKET;
};

export const visitor: Visitor = {
  ClassSelector(node) {
    if (node.data.type === 'ClassSelector') {
      return attributeRegexp(CLASS_ATTRIBUTE, node.data.name);
    }

    return '';
  },

  IdSelector(node) {
    if (node.data.type === 'IdSelector') {
      return attributeRegexp(ID_ATTRIBUTE, node.data.name);
    }
    return '';
  },

  AttributeSelector(node) {
    if (node.data.type === 'AttributeSelector') {
      return attributeRegexp(node.data.name.name, (node.data.value as csstree.Identifier).name);
    }
    return '';
  },

  TypeSelector(node) {
    if (node.data.type === 'TypeSelector') {
      return openingTagRegexp(node.data.name);
    }
    return '';
  },

  WhiteSpace(node) {
    if (node.data.type === 'WhiteSpace') {
      return END_OF_BRACKET + SPACE_BETWEEN_ELEMENT + `(?:\\s${ANY_OPENING_TAG}.*\\s*)*?` + START_OF_BRACKET + TYPE_NAME + ATTRIBUTE_SEPARATOR;
    }
    return '';
  },

  Combinator(node) {
    throw new Error(`Combinator "${(node.data as csstree.Combinator).name}" is not supported.`);
  },

  PseudoElementSelector(node) {
    throw new Error('Pseudo-elements "before" or "after" is not supported.');
  },

  SelectorList(node) {
    throw new Error('SelectorList, like a "a.button", is not supported.');
  },
};

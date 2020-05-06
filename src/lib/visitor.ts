import csstree, { PseudoElementSelector } from 'css-tree';

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
  ClassSelector: (node: csstree.ClassSelector) => SelectorRegexpString;
  IdSelector: (node: csstree.IdSelector) => SelectorRegexpString;
  AttributeSelector: (node: csstree.AttributeSelector) => SelectorRegexpString;
  WhiteSpace: (node: csstree.WhiteSpace) => SelectorRegexpString;
  TypeSelector: (node: csstree.TypeSelector) => SelectorRegexpString;
  Combinator: (node: csstree.Combinator) => NoSupport;
  PseudoElementSelector: (node: PseudoElementSelector) => NoSupport;
  SelectorList: (node: csstree.SelectorList) => NoSupport;
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
  return START_OF_BRACKET + type + END_OF_BRACKET;
};

const closingTagRegexp = (type: string) => {
  return START_OF_BRACKET + '/' + type + END_OF_BRACKET;
};

export const visitor: Visitor = {
  ClassSelector(node) {
    return attributeRegexp(CLASS_ATTRIBUTE, node.name);
  },

  IdSelector(node) {
    return attributeRegexp(ID_ATTRIBUTE, node.name);
  },

  AttributeSelector(node) {
    return attributeRegexp(node.name.name, (node.value as csstree.Identifier).name);
  },

  TypeSelector(node) {
    return openingTagRegexp(node.name);
  },

  WhiteSpace(node) {
    return END_OF_BRACKET + SPACE_BETWEEN_ELEMENT + `(?:\\s${ANY_OPENING_TAG}.*\\s*)*?` + START_OF_BRACKET + TYPE_NAME + ATTRIBUTE_SEPARATOR;
  },

  Combinator(node) {
    throw new Error(`Combinator "${node.name}" is not supported.`);
  },

  PseudoElementSelector(node) {
    throw new Error('Pseudo-elements "before" or "after" is not supported.');
  },

  SelectorList(node) {
    throw new Error('SelectorList, like a "a.button", is not supported.');
  },
};

import csstree, { PseudoElementSelector } from 'css-tree';
import { s2rNode, targetNode } from '../../types';

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
  ClassSelector: (node: s2rNode<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  IdSelector: (node: s2rNode<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  AttributeSelector: (node: s2rNode<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  WhiteSpace: (node: s2rNode<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  TypeSelector: (node: s2rNode<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  Combinator: (node: s2rNode<csstree.CssNode>, list?: targetNode[]) => NoSupport;
  PseudoElementSelector: (node: s2rNode<csstree.CssNode>, list?: targetNode[]) => NoSupport;
  SelectorList: (node: s2rNode<csstree.CssNode>, list?: targetNode[]) => NoSupport;
};

const attributeRegexp = <T extends string>(attribute: string, value: T | T[] | null) => {
  if (!value) {
    return `${attribute}`;
  }

  const valueRegexp = (value: T | T[]) => {
    if (Array.isArray(value) && value.length > 1) {
      const valueString = value.join('|');
      const n = `{${value.length}}`;

      return ANY_VALUE + '(' + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${valueString})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ')' + `${n}` + ANY_VALUE;
    }

    const valueString = Array.isArray(value) ? value.join('|') : value;

    return ANY_VALUE + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${valueString})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ANY_VALUE;
  };

  return `${attribute}=${QUOTE}${valueRegexp(value)}${QUOTE}`;
};

const openingTagRegexpNoClosing = (type: string) => {
  return START_OF_BRACKET + `(${type})` + '\\s*.*?';
};

const openingTagRegexp = (type: string) => {
  return openingTagRegexpNoClosing(type) + END_OF_BRACKET;
};

const closingTagRegexp = (type: string) => {
  return START_OF_BRACKET + '/' + type + END_OF_BRACKET;
};

const findBefore = (node: s2rNode<csstree.CssNode>, type: targetNode['type']) => {
  let result = [];

  let prev = node.prev();

  while (prev) {
    if (prev.data.type === type) {
      result.push(prev);
    }
    prev = prev.prev();
  }

  return result;
};

const findAfter = (node: s2rNode<csstree.CssNode>, type: targetNode['type']) => {
  let result = [];

  let next = node.next();

  while (next) {
    const cursor = next;
    if (cursor.data.type === type && cursor.prev()!.data.type !== 'WhiteSpace' && cursor.prev()!.data.type !== 'Combinator') {
      result.push(cursor);
    }

    next = cursor.next();
  }

  return result;
};

export const visitor: Visitor = {
  ClassSelector(node, list) {
    if (node.data.type !== 'ClassSelector') {
      return '';
    }

    if (findBefore(node, 'ClassSelector').length > 0) {
      return '';
    }

    const afters = findAfter(node, 'ClassSelector');

    if (afters.length > 0) {
      return attributeRegexp(CLASS_ATTRIBUTE, [node.data.name, ...afters.map((node) => (node.data as csstree.ClassSelector).name)]);
    }

    return attributeRegexp(CLASS_ATTRIBUTE, node.data.name);
  },

  IdSelector(node) {
    if (node.data.type !== 'IdSelector') {
      return '';
    }
    return attributeRegexp(ID_ATTRIBUTE, node.data.name);
  },

  AttributeSelector(node) {
    if (node.data.type !== 'AttributeSelector') {
      return '';
    }

    switch (node.data.matcher) {
      case null:
        break;
      case '=':
        break;
      case '~=':
        break;
      case '^=':
        break;
      case '$=':
        break;
      case '*=':
        break;
      default:
        break;
    }

    return attributeRegexp(node.data.name.name, (node.data.value as csstree.Identifier).name);
  },

  TypeSelector(node) {
    if (node.data.type !== 'TypeSelector') {
      return '';
    }

    // if (node.prev()) {
    //   return '';
    // Ignore Sibling, Descendant
    // if (node.prev()!.data.type === 'Combinator' || node.prev()!.data.type === 'WhiteSpace') {
    //   return '';
    // }
    // Previous TypeSelector, don't have these selectors
    // if (node.prev()!.data.type === 'TypeSelector' || node.prev()!.data.type === 'PseudoElementSelector' || node.prev()!.data.type === 'AttributeSelector' || node.prev()!.data.type === 'IdSelector' || node.prev()!.data.type === 'ClassSelector') {
    //   return '';
    // }
    // }

    if (node.next()) {
      if (node.next()!.data.type === 'TypeSelector') {
        throw new Error(`TypeSelector can't be in the next of name type`);
      }
      if (node.next()!.data.type === 'Combinator' || node.next()!.data.type === 'WhiteSpace') {
        throw new Error(`TypeSelector doesn't support "Cominator" and "WhiteSpace"`);
      }

      return openingTagRegexpNoClosing(node.data.name);
    }

    return openingTagRegexp(node.data.name);
  },

  WhiteSpace(node) {
    if (node.data.type !== 'WhiteSpace') {
      return '';
    }
    return END_OF_BRACKET + SPACE_BETWEEN_ELEMENT + `(?:\\s${ANY_OPENING_TAG}.*\\s*)*?` + START_OF_BRACKET + TYPE_NAME + ATTRIBUTE_SEPARATOR;
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

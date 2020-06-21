import csstree, { PseudoElementSelector } from 'css-tree';
import { s2rNode, targetNode } from '../../types';

import {
  START_OF_BRACKET,
  END_OF_BRACKET,
  TYPE_NAME,
  CLASS_ATTRIBUTE,
  ANY_VALUE,
  ID_ATTRIBUTE,
  ATTRIBUTE_SEPARATOR,
  SPACE_BETWEEN_ELEMENT,
  QUOTE,
  BEFORE_ATTRIBUTE,
  AFTER_ATTRIBUTE,
  ANY_OPENING_TAG,
} from './definitions';

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

const multipleValue = (value: string[]) => {
  if (!Array.isArray(value) || value.length <= 1) {
    return null;
  }

  const valueString = value.join('|');
  const n = `{${value.length}}`;

  return ANY_VALUE + '(' + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${valueString})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ')' + `${n}` + ANY_VALUE;
};

const singleValue = (value: string) => {
  return ANY_VALUE + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${value})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ANY_VALUE;
};

const attributeTemplate = (attribute: string, value: string) => `${attribute}=${QUOTE}${value}${QUOTE}`;

const attributeRegexp = <T extends string>(attribute: string, value?: T | T[] | null, matcher?: '=' | '*=' | '~=' | '^=' | '$=') => {
  if (!value) {
    return `${attribute}`;
  }

  if (Array.isArray(value)) {
    return `${attribute}=${QUOTE}${multipleValue(value)}${QUOTE}`;
  }

  if (matcher) {
    switch (matcher) {
      case '=':
        return `${attribute}=${QUOTE}(${value})${QUOTE}`;

      case '*=':
        return attributeTemplate(attribute, singleValue(`([\\w\\d_-]*?${value}[\\w\\d_-]*?)`));

      case '^=':
        return attributeTemplate(attribute, singleValue(`(${value}[\\w\\d_-]*?)`));

      case '$=':
        return attributeTemplate(attribute, singleValue(`([\\w\\d_-]*?${value})`));

      case '~=':
        return attributeTemplate(attribute, singleValue(value));

      default:
        break;
    }
  }

  return attributeTemplate(attribute, singleValue(value));
};

const classRegexp = (value: string | string[]) => attributeRegexp(CLASS_ATTRIBUTE, value);
const idRegexp = (value: string | string[]) => attributeRegexp(ID_ATTRIBUTE, value);

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
  const result = [];

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
  const result = [];

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
      return classRegexp([node.data.name, ...afters.map((node) => (node.data as csstree.ClassSelector).name)]);
    }

    return classRegexp(node.data.name);
  },

  IdSelector(node) {
    if (node.data.type !== 'IdSelector') {
      return '';
    }
    return idRegexp(node.data.name);
  },

  AttributeSelector(node) {
    if (node.data.type !== 'AttributeSelector') {
      return '';
    }

    let result: string;

    switch (node.data.matcher) {
      case null:
        result = attributeRegexp(node.data.name.name);
        break;

      case '=':
        if (node.data.value) {
          const value = node.data.value.type === 'Identifier' ? node.data.value.name : node.data.value.value;
          result = attributeRegexp(node.data.name.name, value.replace(/(:?^['"]|['"]$)/g, ''), node.data.matcher);
          break;
        }
        result = attributeRegexp(node.data.name.name);
        break;

      case '~=':
      case '$=':
      case '^=':
      case '*=':
        result = attributeRegexp(node.data.name.name, (node.data.value as csstree.Identifier).name, node.data.matcher);
        break;

      default:
        result = attributeRegexp(node.data.name.name, (node.data.value as csstree.Identifier).name);
        break;
    }

    return result;
  },

  TypeSelector(node) {
    if (node.data.type !== 'TypeSelector') {
      return '';
    }

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

import csstree from 'css-tree';
import { s2rNode, targetNode } from '../../../types';

import { START_OF_BRACKET, END_OF_BRACKET, TYPE_NAME, ATTRIBUTE_SEPARATOR, SPACE_BETWEEN_ELEMENT, ANY_OPENING_TAG } from './definitions';
import { attributeRegexp, classRegexp, idRegexp, openingTagRegexpNoClosing, openingTagRegexp, findBefore, findAfter } from './utils';

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

export const visitor: Visitor = {
  ClassSelector(node) {
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

    if (node.data.matcher) {
      let result: string;

      switch (node.data.matcher) {
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
    } else {
      return attributeRegexp(node.data.name.name);
    }
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

  PseudoElementSelector() {
    throw new Error('Pseudo-elements "before" or "after" is not supported.');
  },

  SelectorList() {
    throw new Error('SelectorList, like a "a.button", is not supported.');
  },
};

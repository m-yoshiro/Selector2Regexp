import csstree from 'css-tree';
import { s2rListItem, targetNode } from '../../../types';

import { START_OF_BRACKET, END_OF_BRACKET, TYPE_NAME, ATTRIBUTE_SEPARATOR, SPACE_BETWEEN_ELEMENT, ANY_OPENING_TAG } from './definitions';
import { attributeRegexp, classRegexp, idRegexp, openingTagRegexpNoClosing, openingTagRegexp, findBefore, findAfter } from './utils';

type SelectorRegexpString = string;
type NoSupport = Error | void;

export type Visitor = {
  ClassSelector: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  IdSelector: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  AttributeSelector: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  WhiteSpace: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  TypeSelector: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => SelectorRegexpString;
  Combinator: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => NoSupport;
  PseudoElementSelector: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => NoSupport;
  SelectorList: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => NoSupport;
};

export const visitor: Visitor = {
  ClassSelector(listItem) {
    if (listItem.data.type !== 'ClassSelector') {
      return '';
    }

    if (findBefore(listItem, 'ClassSelector').length > 0) {
      return '';
    }

    const afters = findAfter(listItem, 'ClassSelector');

    if (afters.length > 0) {
      return classRegexp([listItem.data.name, ...afters.map((node) => (node.data as csstree.ClassSelector).name)]);
    }

    return classRegexp(listItem.data.name);
  },

  IdSelector(listItem) {
    if (listItem.data.type !== 'IdSelector') {
      return '';
    }
    return idRegexp(listItem.data.name);
  },

  AttributeSelector(listItem) {
    if (listItem.data.type !== 'AttributeSelector') {
      return '';
    }

    if (listItem.data.matcher) {
      let result: string;

      switch (listItem.data.matcher) {
        case '=':
          if (listItem.data.value) {
            const value = listItem.data.value.type === 'Identifier' ? listItem.data.value.name : listItem.data.value.value;
            result = attributeRegexp(listItem.data.name.name, value.replace(/(:?^['"]|['"]$)/g, ''), listItem.data.matcher);
            break;
          }

          result = attributeRegexp(listItem.data.name.name);
          break;
        case '~=':
        case '$=':
        case '^=':
        case '*=':
          let value: null | string = null;
          if (listItem.data.value) {
            value = listItem.data.value.type === 'Identifier' ? listItem.data.value.name : listItem.data.value.value.replace(/[\"\']/g, '');
          }

          result = attributeRegexp(listItem.data.name.name, value, listItem.data.matcher);
          break;
        default:
          result = attributeRegexp(listItem.data.name.name, (listItem.data.value as csstree.Identifier).name);
          break;
      }

      return result;
    } else {
      return attributeRegexp(listItem.data.name.name);
    }
  },

  TypeSelector(listItem) {
    if (listItem.data.type !== 'TypeSelector') {
      return '';
    }

    if (listItem.next()) {
      if (listItem.next()!.data.type === 'TypeSelector') {
        throw new Error(`TypeSelector can't be in the next of name type`);
      }
      if (listItem.next()!.data.type === 'Combinator' || listItem.next()!.data.type === 'WhiteSpace') {
        throw new Error(`TypeSelector doesn't support "Cominator" and "WhiteSpace"`);
      }

      return openingTagRegexpNoClosing(listItem.data.name);
    }

    return openingTagRegexp(listItem.data.name);
  },

  WhiteSpace(listItem) {
    if (listItem.data.type !== 'WhiteSpace') {
      return '';
    }
    return END_OF_BRACKET + SPACE_BETWEEN_ELEMENT + `(?:\\s${ANY_OPENING_TAG}.*\\s*)*?` + START_OF_BRACKET + TYPE_NAME + ATTRIBUTE_SEPARATOR;
  },

  Combinator(listItem) {
    throw new Error(`Combinator "${(listItem.data as csstree.Combinator).name}" is not supported.`);
  },

  PseudoElementSelector() {
    throw new Error('Pseudo-elements "before" or "after" is not supported.');
  },

  SelectorList() {
    throw new Error('SelectorList, like a ".example-a, .example-b", is not supported.');
  },
};

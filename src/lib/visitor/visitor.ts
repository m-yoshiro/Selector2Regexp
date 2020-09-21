import csstree from 'css-tree';
import { s2rListItem, targetNode } from '../../../types';

import { START_OF_BRACKET, END_OF_BRACKET, ANY_TYPE_NAME, ATTRIBUTE_SEPARATOR, SPACE_BETWEEN_ELEMENT, ANY_OPENING_TAG } from './definitions';
import { attributeToRegexp, classRegexp, idRegexp, openingTagRegexpNoClosing, openingTagRegexp, isPrevClassSelector, lookupForward } from './utils';

type SelectorRegexpString = string;
export type NoSupport = Error;

export type VisitorFunction =
  | {
      enter?: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => void;
      leave?: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => void;
    }
  | ((listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => void);

export type Visitor = {
  ClassSelector: VisitorFunction;
  IdSelector: VisitorFunction;
  AttributeSelector: VisitorFunction;
  WhiteSpace: VisitorFunction;
  TypeSelector: VisitorFunction;
  Combinator: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => NoSupport;
  PseudoElementSelector: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => NoSupport;
  SelectorList: (listItem: s2rListItem<csstree.CssNode>, list?: targetNode[]) => NoSupport;
};

const hasMultipleSelector = (listItem: s2rListItem<csstree.CssNode>) => {
  const next = listItem.next();
  if (!next) return false;

  const { type } = next.data;

  return type === 'TypeSelector' || type === 'IdSelector' || type === 'ClassSelector' || type === 'AttributeSelector';
};

export const visitor: Visitor = {
  ClassSelector: {
    enter: (listItem) => {
      if (listItem.data.type !== 'ClassSelector') {
        return null;
      }

      // Skip when prev item is ClassSelector.
      if (isPrevClassSelector(listItem)) {
        return null;
      }

      const afters = lookupForward(listItem, 'ClassSelector');

      if (hasMultipleSelector(listItem)) {
      }

      if (afters.length > 0) {
        // For multiple selector
        listItem.value = classRegexp([listItem.data.name, ...afters.map((node) => (node.data as csstree.ClassSelector).name)]);
      } else {
        listItem.value = classRegexp(listItem.data.name);
      }
    },
  },

  IdSelector: {
    enter: (listItem) => {
      if (listItem.data.type !== 'IdSelector') {
        return null;
      }

      listItem.value = idRegexp(listItem.data.name);
    },
  },

  AttributeSelector: {
    enter: (listItem) => {
      if (listItem.data.type !== 'AttributeSelector') {
        return null;
      }

      if (listItem.data.matcher) {
        let result: string;
        switch (listItem.data.matcher) {
          case '=':
            if (listItem.data.value) {
              const value = listItem.data.value.type === 'Identifier' ? listItem.data.value.name : listItem.data.value.value;
              result = attributeToRegexp(listItem.data.name.name, value.replace(/(:?^['"]|['"]$)/g, ''), listItem.data.matcher);
              break;
            }

            result = attributeToRegexp(listItem.data.name.name);
            break;
          case '~=':
          case '$=':
          case '^=':
          case '*=':
            let value: null | string = null;
            if (listItem.data.value) {
              value = listItem.data.value.type === 'Identifier' ? listItem.data.value.name : listItem.data.value.value.replace(/[\"\']/g, '');
            }
            result = attributeToRegexp(listItem.data.name.name, value, listItem.data.matcher);
            break;
          default:
            result = attributeToRegexp(listItem.data.name.name, (listItem.data.value as csstree.Identifier).name);
            break;
        }

        listItem.value = result;
      } else {
        listItem.value = attributeToRegexp(listItem.data.name.name);
      }
    },
  },

  TypeSelector: {
    enter: (listItem) => {
      if (listItem.data.type !== 'TypeSelector') {
        return null;
      }

      if (listItem.next()) {
        if (listItem.next()!.data.type === 'TypeSelector') {
          throw new Error(`TypeSelector can't be in the next of name type`);
        }
        if (listItem.next()!.data.type === 'Combinator' || listItem.next()!.data.type === 'WhiteSpace') {
          throw new Error(`TypeSelector doesn't support "Cominator" and "WhiteSpace"`);
        }

        listItem.value = openingTagRegexpNoClosing(listItem.data.name);
      } else {
        listItem.value = openingTagRegexp(listItem.data.name);
      }
    },
  },

  WhiteSpace: {
    enter: (listItem) => {
      if (listItem.data.type !== 'WhiteSpace') {
        return null;
      }

      listItem.value = END_OF_BRACKET + SPACE_BETWEEN_ELEMENT + `(?:\\s${ANY_OPENING_TAG}.*\\s*)*?` + START_OF_BRACKET + ANY_TYPE_NAME + ATTRIBUTE_SEPARATOR;
    },
  },

  Combinator: (listItem) => {
    throw new Error(`Combinator "${(listItem.data as csstree.Combinator).name}" is not supported.`);
    // enter: (listItem) => {
    //   if (listItem.data.type !== 'Combinator') {
    //     return null;
    //   }
    //   switch (listItem.data.name) {
    //     case '>':
    //     case '+':
    //     case '~':
    //     default:
    //       throw new Error(`Combinator "${(listItem.data as csstree.Combinator).name}" is not supported.`);
    //   }
    // },
  },

  PseudoElementSelector: () => {
    throw new Error('Pseudo-elements "before" or "after" is not supported.');
  },

  SelectorList: () => {
    throw new Error('SelectorList, like a ".example-a, .example-b", is not supported.');
  },
};

import csstree from 'css-tree';
import { targetNode, s2r } from '../../../types';

import { START_OF_BRACKET, END_OF_BRACKET, TYPE_NAME, ATTRIBUTE_SEPARATOR, SPACE_BETWEEN_ELEMENT, ANY_OPENING_TAG } from './definitions';
import { attributeRegexp, classRegexp, idRegexp, openingTagRegexpNoClosing, openingTagRegexp, isPrevClassSelector, lookupForward, childCombinatorRegexp } from './utils';

export type NoSupport = Error;

export type VisitorFunction =
  | {
      enter?: (node: s2r.Node<csstree.CssNode>, list?: targetNode[]) => void;
      leave?: (node: s2r.Node<csstree.CssNode>, list?: targetNode[]) => void;
    }
  | ((node: s2r.Node<csstree.CssNode>, list?: targetNode[]) => void);

export type Visitor = {
  ClassSelector: VisitorFunction;
  IdSelector: VisitorFunction;
  AttributeSelector: VisitorFunction;
  WhiteSpace: VisitorFunction;
  TypeSelector: VisitorFunction;
  Combinator: VisitorFunction | ((node: s2r.Node<csstree.CssNode>, list?: targetNode[]) => NoSupport);
  PseudoElementSelector: (node: s2r.Node<csstree.CssNode>, list?: targetNode[]) => NoSupport;
  SelectorList: (node: s2r.Node<csstree.CssNode>, list?: targetNode[]) => NoSupport;
};

export const visitor: Visitor = {
  ClassSelector: {
    enter: (node) => {
      if (node.data.type !== 'ClassSelector') {
        return null;
      }

      // Skip when prev item is ClassSelector.
      if (isPrevClassSelector(node)) {
        return null;
      }

      // Skip when node is a part of group
      if (node.relationType === 'group') {
        return null;
      }

      const afters = lookupForward(node, 'ClassSelector');
      if (afters.length > 0) {
        // For multiple selector
        node.value = classRegexp([node.data.name, ...afters.map((node) => (node.data as csstree.ClassSelector).name)]);
      } else {
        node.value = classRegexp(node.data.name);
      }
    },
  },

  IdSelector: {
    enter: (node) => {
      if (node.data.type !== 'IdSelector') {
        return null;
      }

      node.value = idRegexp(node.data.name);
    },
  },

  AttributeSelector: {
    enter: (node) => {
      if (node.data.type !== 'AttributeSelector') {
        return null;
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
            let value: null | string = null;
            if (node.data.value) {
              value = node.data.value.type === 'Identifier' ? node.data.value.name : node.data.value.value.replace(/[\"\']/g, '');
            }
            result = attributeRegexp(node.data.name.name, value, node.data.matcher);
            break;
          default:
            result = attributeRegexp(node.data.name.name, (node.data.value as csstree.Identifier).name);
            break;
        }

        node.value = result;
      } else {
        node.value = attributeRegexp(node.data.name.name);
      }
    },
  },

  TypeSelector: {
    enter: (node) => {
      if (node.data.type !== 'TypeSelector') {
        return null;
      }

      if (node.next()) {
        if (node.next()!.data.type === 'TypeSelector') {
          throw new Error(`TypeSelector can't be in the next of name type`);
        }
        if (node.next()!.data.type === 'Combinator' || node.next()!.data.type === 'WhiteSpace') {
          throw new Error(`TypeSelector doesn't support "Cominator" and "WhiteSpace"`);
        }

        node.value = openingTagRegexpNoClosing(node.data.name);
      } else {
        node.value = openingTagRegexp(node.data.name);
      }
    },
  },

  WhiteSpace: {
    enter: (node) => {
      if (node.data.type !== 'WhiteSpace') {
        return null;
      }

      node.value = END_OF_BRACKET + SPACE_BETWEEN_ELEMENT + `(?:\\s${ANY_OPENING_TAG}.*\\s*)*?` + START_OF_BRACKET + TYPE_NAME + ATTRIBUTE_SEPARATOR;
    },
  },

  Combinator: {
    enter: (node) => {
      if (node.data.type !== 'Combinator') {
        return null;
      }
      switch (node.data.name) {
        case '>':
          return null;
        case '+':
        case '~':
        default:
          throw new Error(`Combinator "${(node.data as csstree.Combinator).name}" is not supported.`);
      }
    },
    leave: (node) => {
      // Leaveの時にprevとnextを合わせて処理する
      if (node.data.type !== 'Combinator') {
        return null;
      }
      switch (node.data.name) {
        case '>':
          return null;
        case '+':
        case '~':
        default:
          return null;
      }
    },
  },

  PseudoElementSelector: () => {
    throw new Error('Pseudo-elements "before" or "after" is not supported.');
  },

  SelectorList: () => {
    throw new Error('SelectorList, like a ".example-a, .example-b", is not supported.');
  },
};

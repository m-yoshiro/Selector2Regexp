import csstree from 'css-tree';
import { s2rListItem, targetNode } from '../../../types';

import { START_OF_BRACKET, END_OF_BRACKET, CLASS_ATTRIBUTE, ANY_VALUE, ID_ATTRIBUTE, SPACE_BETWEEN_ELEMENT, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE } from './definitions';

export const multipleValue = (value: string[]) => {
  if (!Array.isArray(value) || value.length <= 1) {
    return null;
  }

  const valueString = value.join('|');
  const n = `{${value.length}}`;

  return ANY_VALUE + '(' + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${valueString})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ')' + `${n}` + ANY_VALUE;
};

export const singleValue = (value: string) => {
  return ANY_VALUE + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${value})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ANY_VALUE;
};

export const attributeTemplate = (attribute: string, value: string) => `${attribute}=${QUOTE}${value}${QUOTE}`;

export const attributeRegexp = <T extends string>(attribute: string, value?: T | T[] | null, matcher?: '=' | '*=' | '~=' | '^=' | '$=') => {
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

export const classRegexp = (value: string | string[]) => attributeRegexp(CLASS_ATTRIBUTE, value);

export const idRegexp = (value: string | string[]) => attributeRegexp(ID_ATTRIBUTE, value);

export const openingTagRegexpNoClosing = (type: string) => {
  return START_OF_BRACKET + `(${type})` + '\\s*.*?';
};

export const openingTagRegexp = (type: string) => {
  return openingTagRegexpNoClosing(type) + END_OF_BRACKET;
};

export const closingTagRegexp = (type: string) => {
  return START_OF_BRACKET + '/' + type + END_OF_BRACKET;
};

export const isPrevClassSelector = (node: s2rListItem<csstree.CssNode>) => {
  const prev = node.prev();
  return prev && prev.data.type === 'ClassSelector';
};

export const findAfter = (node: s2rListItem<csstree.CssNode>, type: targetNode['type']) => {
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

import csstree from 'css-tree';
import { s2rListItem, targetNode } from '../../../types';

import { START_OF_BRACKET, END_OF_BRACKET, CLASS_ATTRIBUTE, ANY_VALUE, ID_ATTRIBUTE, SPACE_BETWEEN_ELEMENT, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE } from '../utils/definitions';

type Matcher = '=' | '*=' | '~=' | '^=' | '$=';
interface AttributeValue {
  value: string;
  matcher?: Matcher;
}

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

export const attributeRegexpTemplate = (attribute: string, value?: string) => {
  if (!value) {
    return attribute;
  }
  return `${attribute}=${QUOTE}${value}${QUOTE}`;
};

const convertValue = (attrValue: AttributeValue) => {
  const { value, matcher } = attrValue;

  // With Matcher
  if (matcher) {
    if (matcher === '=') {
      return value;
    } else if (matcher === '*=') {
      return `([\\w\\d_-]*?${value}[\\w\\d_-]*?)`;
    } else if (matcher === '^=') {
      return `(${value}[\\w\\d_-]*?)`;
    } else if (matcher === '$=') {
      return `([\\w\\d_-]*?${value})`;
    } else if (matcher === '~=') {
      return value;
    } else {
      return '';
    }
  } else {
    return value;
  }
};

const multipleValueTemplate = (value: string, n: number) =>
  ANY_VALUE + '(' + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${value})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ')' + `${n}` + ANY_VALUE;
const singleValueTemplate = (value: string) => ANY_VALUE + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${value})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ANY_VALUE;

const valueToRegexp = (attrValue: AttributeValue | AttributeValue[]) => {
  if (!Array.isArray(attrValue)) {
    const value = convertValue(attrValue);
    return singleValueTemplate(value);
  }

  const valueString = attrValue.map((val) => convertValue(val)).join('|');
  const n = attrValue.length;
  return multipleValueTemplate(valueString, n);
};

export const attributeToRegexp = <T extends string>(name: string, attrValues?: AttributeValue[]) => {
  if (!attrValues) return attributeRegexpTemplate(name);

  return valueToRegexp(attrValues);
};

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

export const lookupForward = (node: s2rListItem<csstree.CssNode>, type: targetNode['type']) => {
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

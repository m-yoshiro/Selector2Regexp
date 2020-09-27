import { Attribute } from '../../../types';
import { ANY_VALUE, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE, SPACE_BETWEEN_VALUE } from '../utils/definitions';
import { attributeRegexpTemplate } from './attributeRegexTemplate';

const convertValueWithMatcher = (attrValue: Attribute) => {
  const { value, matcher } = attrValue;

  let result: string;

  // With Matcher
  if (matcher && value) {
    if (matcher === '=') {
      result = value;
    } else if (matcher === '*=') {
      result = `[\\w\\d_-\\s]*?${value}[\\w\\d_-\\s]*?`;
    } else if (matcher === '^=') {
      result = `${value}[\\w\\d_-]*?`;
    } else if (matcher === '$=') {
      result = `[\\w\\d_-]*?${value}`;
    } else if (matcher === '~=') {
      result = `(?=(.*[\\s'"]${value}[\\s'"])).*`;
    } else {
      result = '';
    }
  } else {
    result = '';
  }

  return result;
};

const convertSelectorOrIdValue = (value: string) => `(?=(.*[\\s'"]${value}[\\s'"])).*`;

export const attributeToRegexp = (attr: Attribute) => {
  if (!attr.value) {
    return attributeRegexpTemplate(attr.name);
  } else if (attr.matcher) {
    // Remove quotes if a value contains.
    attr.value = attr.value.replace(/(:?^['"]|['"]$)/g, '');
    return attributeRegexpTemplate(attr.name, `(${QUOTE}${convertValueWithMatcher(attr)}${QUOTE})`);
  } else {
    return attributeRegexpTemplate(attr.name, `(?=${QUOTE})${convertSelectorOrIdValue(attr.value)}(?=${QUOTE})`);
  }
};

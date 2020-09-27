import { Attribute } from '../../../types';
import { QUOTE, QUOTE_OR_SPACE, ANY } from '../utils/definitions';
import { attributeRegexpTemplate } from './attributeRegexTemplate';

const prerequisite = (condition: string) => `(?=(${ANY}${QUOTE_OR_SPACE}${condition}${QUOTE_OR_SPACE}))`;

const convertValueWithMatcher = (attrValue: Attribute) => {
  const { value, matcher } = attrValue;

  let result: string | null;

  // With Matcher
  if (matcher && value) {
    if (matcher === '=') {
      // This matcher needs a strict condition
      result = `${QUOTE}${value}${QUOTE}`;
    } else if (matcher === '*=') {
      result = `(?=${QUOTE})${prerequisite(`[\\w\\d_-\\s]*?${value}[\\w\\d_-\\s]*?`)}${ANY}(?=${QUOTE})`;
    } else if (matcher === '^=') {
      result = `(?=${QUOTE})${prerequisite(`${value}[\\w\\d_-]*?`)}${ANY}(?=${QUOTE})`;
    } else if (matcher === '$=') {
      result = `(?=${QUOTE})${prerequisite(`[\\w\\d_-]*?${value}`)}${ANY}(?=${QUOTE})`;
    } else if (matcher === '~=') {
      result = `(?=${QUOTE})${prerequisite(value)}${ANY}(?=${QUOTE})`;
    } else {
      result = null;
    }
    return result;
  } else {
    return null;
  }
};

export const attributeToRegexp = (attr: Attribute) => {
  if (!attr.value) {
    return attributeRegexpTemplate(attr.name);
  } else if (attr.matcher) {
    // Remove quotes if a value contains.
    attr.value = attr.value.replace(/(:?^['"]|['"]$)/g, '');
    return attributeRegexpTemplate(attr.name, convertValueWithMatcher(attr));
  } else {
    return attributeRegexpTemplate(attr.name, `(?=${QUOTE})${prerequisite(attr.value)}${ANY}(?=${QUOTE})`);
  }
};

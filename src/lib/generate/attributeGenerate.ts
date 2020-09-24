import { Attribute } from '../../../types';
import { ANY_VALUE, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE, SPACE_BETWEEN_VALUE } from '../utils/definitions';

const wrapQuate = (value: string) => {
  return `${QUOTE}${value}${QUOTE}`;
};

export const attributeRegexpTemplate = (name: string, value?: string) => {
  if (!value) {
    return name;
  }
  return `${name}=${wrapQuate(value)}`;
};

const convertValueWithMatcher = (attrValue: Attribute) => {
  const { value, matcher } = attrValue;

  // With Matcher
  if (matcher && value) {
    if (matcher === '=') {
      return `${value}`;
    } else if (matcher === '*=') {
      return `[\\w\\d_-\\s]*?${value}[\\w\\d_-\\s]*?`;
    } else if (matcher === '^=') {
      return `${value}[\\w\\d_-]*?`;
    } else if (matcher === '$=') {
      return `[\\w\\d_-]*?${value}`;
    } else if (matcher === '~=') {
      return ANY_VALUE + SPACE_BETWEEN_VALUE + BEFORE_ATTRIBUTE + `${value}` + AFTER_ATTRIBUTE + SPACE_BETWEEN_VALUE + ANY_VALUE;
    } else {
      return '';
    }
  } else if (value) {
    return `${value}`;
  } else {
    return '';
  }
};

const convertSelectorOrIdValue = (value: string) => ANY_VALUE + SPACE_BETWEEN_VALUE + BEFORE_ATTRIBUTE + `${value}` + AFTER_ATTRIBUTE + SPACE_BETWEEN_VALUE + ANY_VALUE;

export const attributeToRegexp = (attr: Attribute) => {
  if (!attr.value) {
    return attributeRegexpTemplate(attr.name);
  } else if (attr.matcher) {
    // Remove quates if a value contains.
    attr.value = attr.value.replace(/(:?^['"]|['"]$)/g, '');
    return attributeRegexpTemplate(attr.name, `(${convertValueWithMatcher(attr)})`);
  } else {
    return attributeRegexpTemplate(attr.name, `(${convertSelectorOrIdValue(attr.value)})`);
  }
};

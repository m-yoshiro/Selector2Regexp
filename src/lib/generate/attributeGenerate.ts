import { Attribute } from '../../../types';
import { START_OF_BRACKET, END_OF_BRACKET, CLASS_ATTRIBUTE, ANY_VALUE, ID_ATTRIBUTE, SPACE_BETWEEN_ELEMENT, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE, SPACE_BETWEEN_VALUE } from '../utils/definitions';
import { openingTagRegexp } from './elementGenerate';

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

export const multipleValue = (value: string[]) => {
  if (!Array.isArray(value) || value.length <= 1) {
    return null;
  }

  const valueString = value.join('|');
  const n = `{${value.length}}`;

  return ANY_VALUE + '(' + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${valueString})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ')' + `${n}` + ANY_VALUE;
};

const convertSelectorOrIdValue = (value: string) => ANY_VALUE + SPACE_BETWEEN_VALUE + BEFORE_ATTRIBUTE + `${value}` + AFTER_ATTRIBUTE + SPACE_BETWEEN_VALUE + ANY_VALUE;

export const attributeToRegexp = (attributes: Attribute[]) => {
  const names = [...new Set(attributes.map((item) => item.name))];
  const attrsWithMatcher = attributes.filter((item) => !!item.matcher);
  const attrsWithoutMatcher = names.map((name) => {
    const valueArr = attributes.filter((x) => x.name === name && !x.matcher).map((y) => (y.value ? y.value : ''));
    return {
      name,
      value: valueArr.length === 1 ? valueArr[0] : multipleValue(valueArr) || '',
    } as Attribute;
  });

  const array = [...attrsWithMatcher, ...attrsWithoutMatcher];

  return array
    .map((attr) => {
      if (attr.value) {
        return attributeRegexpTemplate(attr.name);
      } else if (attr.matcher) {
        // Remove quates if a value contains.
        attr.value = attr.value ? attr.value.replace(/(:?^['"]|['"]$)/g, '') : '';
        return attributeRegexpTemplate(attr.name, `(${convertValueWithMatcher(attr)})`);
      } else {
        return attributeRegexpTemplate(attr.name, `(${convertSelectorOrIdValue(attr.value || '')})`);
      }
    })
    .join('|');
};

import { START_OF_BRACKET, END_OF_BRACKET, CLASS_ATTRIBUTE, ANY_VALUE, ID_ATTRIBUTE, SPACE_BETWEEN_ELEMENT, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE } from '../visitor/definitions';

type Matcher = '=' | '*=' | '~=' | '^=' | '$=' | string | null;

export interface AttributeValue {
  value?: string | null;
  matcher?: Matcher;
}

const wrapQuate = (value: string) => {
  return `${QUOTE}${value}${QUOTE}`;
};

export const attributeRegexpTemplate = (attribute: string, value?: string) => {
  if (!value) {
    return attribute;
  }
  return `${attribute}=${wrapQuate(value)}`;
};

const convertValue = (attrValue: AttributeValue) => {
  const { value, matcher } = attrValue;

  // With Matcher
  if (matcher && value) {
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
  } else if (value) {
    return value;
  } else {
    return '';
  }
};

const multipleValueTemplate = (value: string, n: number) =>
  ANY_VALUE + '(' + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${value})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ')' + `${n}` + ANY_VALUE;

const singleValueTemplate = (value: string) => ANY_VALUE + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${value})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ANY_VALUE;

const valueToRegexp = (attrValue: AttributeValue | AttributeValue[]) => {
  if (!Array.isArray(attrValue) || attrValue.length === 1) {
    // Single value
    attrValue = Array.isArray(attrValue) ? attrValue[0] : attrValue;
    const value = convertValue(attrValue);
    return singleValueTemplate(value);
  } else {
    // Multiple values
    const valueString = attrValue.map((val) => convertValue(val)).join('|');
    const n = attrValue.length;
    return multipleValueTemplate(valueString, n);
  }
};

export const attributeToRegexp = (name: string, attrValues?: AttributeValue[]) => {
  if (!attrValues) return attributeRegexpTemplate(name);

  return valueToRegexp(attrValues);
};

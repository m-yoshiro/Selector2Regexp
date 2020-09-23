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

export const idToRegexp = (id: string) => {
  const attrName = 'id';
  const valueRegex = ANY_VALUE + SPACE_BETWEEN_VALUE + BEFORE_ATTRIBUTE + `(${id})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_VALUE + ANY_VALUE;

  return attributeRegexpTemplate(attrName, valueRegex);
};

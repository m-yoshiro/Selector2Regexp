import { ANY_VALUE, SPACE_BETWEEN_ELEMENT, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE, SPACE_BETWEEN_VALUE } from '../utils/definitions';

const wrapQuate = (value: string) => {
  return `${QUOTE}${value}${QUOTE}`;
};

export const attributeRegexpTemplate = (name: string, value?: string) => {
  if (!value) {
    return name;
  }
  return `${name}=${wrapQuate(value)}`;
};

export const classToRegexp = (classList: string[]) => {
  const valueString = classList.join('|');
  const n = classList.length;
  const attrName = 'class';
  let valueRegex: string;

  if (n > 1) {
    valueRegex = ANY_VALUE + '(' + SPACE_BETWEEN_ELEMENT + BEFORE_ATTRIBUTE + `(${valueString})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_ELEMENT + ')' + `{${n}}` + ANY_VALUE;
  } else {
    valueRegex = ANY_VALUE + SPACE_BETWEEN_VALUE + BEFORE_ATTRIBUTE + `(${valueString})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_VALUE + ANY_VALUE;
  }

  return attributeRegexpTemplate(attrName, valueRegex);
};

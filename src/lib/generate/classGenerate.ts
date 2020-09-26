import { ANY_VALUE, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE, SPACE_BETWEEN_VALUE } from '../utils/definitions';

export const attributeRegexpTemplate = (name: string, value?: string) => {
  if (!value) {
    return name;
  }
  return `${name}=${value}`;
};

export const classToRegexp = (classList: string[]) => {
  const isMultiple = classList.length >= 2;
  let valueString: string;

  if (isMultiple) {
    valueString = classList
      .map((classItem) => {
        return `(?=(.*[\\s'"]${classItem}[\\s'"]))`;
      })
      .join('');
  } else {
    valueString = classList[0];
  }

  const attrName = 'class';
  let valueRegex: string;

  if (isMultiple) {
    valueRegex = `(?=${QUOTE})(${valueString}.*)(?=${QUOTE})`;
  } else {
    valueRegex = QUOTE + ANY_VALUE + SPACE_BETWEEN_VALUE + BEFORE_ATTRIBUTE + `(${valueString})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_VALUE + ANY_VALUE + QUOTE;
  }

  return attributeRegexpTemplate(attrName, valueRegex);
};

import { ANY_VALUE, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE, SPACE_BETWEEN_VALUE } from '../utils/definitions';
import { attributeRegexpTemplate } from './attributeRegexTemplate';

export const classToRegexp = (classList: string[]) => {
  const valueString = classList
    .map((classItem) => {
      return `(?=(.*[\\s'"]${classItem}[\\s'"]))`;
    })
    .join('');

  const attrName = 'class';
  const valueRegex = `(?=${QUOTE})(${valueString}.*)(?=${QUOTE})`;

  return attributeRegexpTemplate(attrName, valueRegex);
};

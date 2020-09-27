import { QUOTE, ANY, QUOTE_OR_SPACE } from '../utils/definitions';
import { attributeRegexpTemplate } from './attributeRegexTemplate';

export const classToRegexp = (classList: string[]) => {
  const valueString = classList
    .map((classItem) => {
      return `(?=(${ANY}${QUOTE_OR_SPACE}${classItem}${QUOTE_OR_SPACE}))`;
    })
    .join('');

  const attrName = 'class';
  const valueRegex = `(?=${QUOTE})(${valueString}${ANY})(?=${QUOTE})`;

  return attributeRegexpTemplate(attrName, valueRegex);
};

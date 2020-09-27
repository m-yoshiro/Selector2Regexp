import { ANY_VALUE, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE, SPACE_BETWEEN_VALUE } from '../utils/definitions';
import { attributeRegexpTemplate } from './attributeRegexTemplate';

export const idToRegexp = (id: string) => {
  const attrName = 'id';
  const valueRegex = ANY_VALUE + SPACE_BETWEEN_VALUE + BEFORE_ATTRIBUTE + `(${id})` + AFTER_ATTRIBUTE + SPACE_BETWEEN_VALUE + ANY_VALUE;

  return attributeRegexpTemplate(attrName, `(${QUOTE}${valueRegex}${QUOTE})`);
};

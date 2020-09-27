import { ANY_VALUE, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE, SPACE_BETWEEN_VALUE } from '../utils/definitions';
import { attributeRegexpTemplate } from './attributeRegexTemplate';

export const idToRegexp = (id: string) => {
  const attrName = 'id';
  const valueRegex = `(?=(.*[\\s'"]${id}[\\s'"]))`;

  return attributeRegexpTemplate(attrName, `(?=${QUOTE})(${valueRegex}.*)(?=${QUOTE})`);
};

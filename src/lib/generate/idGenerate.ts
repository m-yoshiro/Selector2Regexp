import { QUOTE, ANY, QUOTE_OR_SPACE } from '../utils/definitions';
import { attributeRegexpTemplate } from './attributeRegexTemplate';

export const idToRegexp = (id: string) => {
  const attrName = 'id';
  const valueRegex = `(?=(${ANY}${QUOTE_OR_SPACE}${id}${QUOTE_OR_SPACE}))`;

  return attributeRegexpTemplate(attrName, `(?=${QUOTE})(${valueRegex}${ANY})(?=${QUOTE})`);
};

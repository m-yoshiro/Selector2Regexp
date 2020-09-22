import {
  START_OF_BRACKET,
  END_OF_BRACKET,
  CLASS_ATTRIBUTE,
  ANY_VALUE,
  ID_ATTRIBUTE,
  SPACE_BETWEEN_ELEMENT,
  QUOTE,
  BEFORE_ATTRIBUTE,
  AFTER_ATTRIBUTE,
  ANY_TYPE_NAME,
  ATTRIBUTE_SEPARATOR,
} from '../visitor/definitions';

export const elementTemplate = (value: { type?: string; attributes?: string }) => {
  if (value.type && !value.attributes) {
    return openingTagRegexp(value.type);
  }

  const type = value.type || ANY_TYPE_NAME;
  const attributes = value.attributes || '';

  return START_OF_BRACKET + type + ATTRIBUTE_SEPARATOR + attributes + END_OF_BRACKET;
};

export const openingTagRegexpNoClosing = (type: string) => {
  return START_OF_BRACKET + `(${type})` + '\\s*.*?';
};

export const openingTagRegexp = (type: string) => {
  return openingTagRegexpNoClosing(type) + END_OF_BRACKET;
};

export const closingTagRegexp = (type: string) => {
  return START_OF_BRACKET + '/' + type + END_OF_BRACKET;
};

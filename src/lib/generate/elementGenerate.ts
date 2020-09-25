import { START_OF_BRACKET, END_OF_BRACKET, ANY_TYPE_NAME, ATTRIBUTE_SEPARATOR } from '../utils/definitions';

export const elementTemplate = (value: { type?: string; attributes?: string }) => {
  if (value.type && !value.attributes) {
    return openingTag(value.type);
  }

  const type = value.type || ANY_TYPE_NAME;
  const attributes = value.attributes || '';

  return START_OF_BRACKET + type + ATTRIBUTE_SEPARATOR + attributes + END_OF_BRACKET;
};

export const openingTagNoClosing = (type: string) => {
  return START_OF_BRACKET + `(${type})` + '\\s*.*?';
};

export const openingTag = (type: string) => {
  return openingTagNoClosing(type) + END_OF_BRACKET;
};

export const closingTag = (type: string) => {
  return START_OF_BRACKET + '/' + type + END_OF_BRACKET;
};

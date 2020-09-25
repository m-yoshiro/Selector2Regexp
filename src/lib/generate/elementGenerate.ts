import { START_OF_BRACKET, END_OF_BRACKET, ANY_TYPE_NAME, ATTRIBUTE_SEPARATOR } from '../utils/definitions';

const attributesCompile = (attrs: string[]) => {
  if (attrs.length >= 2) {
    return attrs.join('|') + `{${attrs.length}}`;
  } else {
    return attrs.join('');
  }
};

export const elementTemplate = (value: { type: string; attributes?: string[] }) => {
  if (!value.attributes || value.attributes.length < 1) {
    return START_OF_BRACKET + `(${value.type})` + '\\s*.*?' + END_OF_BRACKET;
  }

  const type = value.type || ANY_TYPE_NAME;
  const attributes = value.attributes;

  return START_OF_BRACKET + type + ATTRIBUTE_SEPARATOR + attributesCompile(attributes) + END_OF_BRACKET;
};

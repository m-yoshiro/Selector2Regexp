import { START_OF_BRACKET, END_OF_BRACKET, ANY_TYPE_NAME, ATTRIBUTE_SEPARATOR, ANY } from '../utils/definitions';

const attributesCompile = (attrs: string[]) => {
  if (attrs.length >= 2) {
    return ANY + `(${attrs.join('|')})` + ANY + `{${attrs.length}}`;
  } else {
    return ANY + `(${attrs.join('')})` + ANY;
  }
};

export const elementTemplate = (value: { type: string; attributes?: string[] }) => {
  const { type, attributes } = value;
  if (!attributes || attributes.length < 1) {
    return START_OF_BRACKET + `(${value.type})` + '\\s*.*?' + END_OF_BRACKET;
  }

  return START_OF_BRACKET + `(${type || ANY_TYPE_NAME})` + ATTRIBUTE_SEPARATOR + attributesCompile(attributes) + END_OF_BRACKET;
};

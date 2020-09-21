import { START_OF_BRACKET, END_OF_BRACKET, CLASS_ATTRIBUTE, ANY_VALUE, ID_ATTRIBUTE, SPACE_BETWEEN_ELEMENT, QUOTE, BEFORE_ATTRIBUTE, AFTER_ATTRIBUTE } from '../visitor/definitions';

export const combinatorGenerate = (name: string, ancestor: string) => {
  if (name === 'WhiteSpace') {
    return ancestor + SPACE_BETWEEN_ELEMENT;
  } else if (name === '>') {
    return `(?=${ancestor}\s+)`;
  }
};

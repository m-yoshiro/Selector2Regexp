import { SPACE_BETWEEN_ELEMENT, ANY_OPENING_TAG, ANY_CLOSING_TAG } from '../utils/definitions';

export const combinatorGenerate = (name: string, ancestor: string) => {
  if (name === 'WhiteSpace') {
    return `(${ancestor + SPACE_BETWEEN_ELEMENT})(?:\\s${ANY_OPENING_TAG}.*\\s*)*?`;
  } else if (name === '>') {
    return `(?<=${ancestor}\\s*(${ANY_CLOSING_TAG}){0}\\s*(${ANY_OPENING_TAG}.*${ANY_CLOSING_TAG}\\s*)*)`;
  } else if (name === '+') {
    return `(?<=${ancestor}.*${ANY_CLOSING_TAG}\\s*)`;
  } else if (name === '~') {
    return `(?<=${ancestor}.*${ANY_CLOSING_TAG}\\s*(${ANY_OPENING_TAG}.*${ANY_CLOSING_TAG}\\s*)*)`;
  }
};

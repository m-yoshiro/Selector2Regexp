export const START_OF_BRACKET = '<\\s*';
export const END_OF_BRACKET = '\\s*>';
export const ANY_TYPE_NAME = '\\w+';
export const CLASS_ATTRIBUTE = 'class';
export const ANY_VALUE = '\\w*';
export const ANY_ATTRIBUTE_NAME = '[\\w-]*';
export const ANY_ATTRIBUTE_VALUE = '[\\w-=:]*';
export const ID_ATTRIBUTE = 'id';
export const ATTRIBUTE_SEPARATOR = '\\s+';
export const SPACE_BETWEEN_ELEMENT = '\\s*';
export const SPACE_BETWEEN_VALUE = '\\s*';
export const QUOTE = '[\'"]';
export const BEFORE_ATTRIBUTE = '(?<!\\w)'; // ES2018
export const AFTER_ATTRIBUTE = '(?!\\w)';
export const ANY_OPENING_TAG = '<.*>';
export const ANY_CLOSING_TAG = '</.*>';
export const ANY = '.*';

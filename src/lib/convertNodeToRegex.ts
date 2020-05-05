import csstree from 'css-tree';

const START_OF_BRACKET = '<\\s*';
const END_OF_BRACKET = '\\s*>';
const TYPE_NAME = '\\w+';
const CLASS_ATTRIBUTE = 'class';
const ANY_VALUE = '\\w*';
const ID_ATTRIBUTE = 'id';
const ATTRIBUTE_SEPARATOR = '\\s+';
const SPACE_BETWEEN_ELEMENT = '\\s*';
const QUOTE = '[\'"]';
const BEFORE_ATTRIBUTE = `(?<!\\w)`; // ES2018
const AFTER_ATTRIBUTE = '(?!\\w)';

const attributeRegexp = <T extends string>(attribute: string, value: T | T[] | null) => {
  if (!value) {
    return `${attribute}`;
  }

  const valueRegexp = (value: T | T[]) => {
    const valueString = Array.isArray(value) ? value.join('|') : value;
    const n = Array.isArray(value) ? `{${value.length}}` : '';

    return `${ANY_VALUE}${SPACE_BETWEEN_ELEMENT}${BEFORE_ATTRIBUTE}(${valueString})${AFTER_ATTRIBUTE}${SPACE_BETWEEN_ELEMENT}${ANY_VALUE}${n}`;
  };

  return `${attribute}=${QUOTE}${valueRegexp(value)}${QUOTE}`;
};

const openingTagRegexp = (type: string, attribute?: string) => {
  return START_OF_BRACKET + type + END_OF_BRACKET;
};

const closingTagRegexp = (type: string) => {
  return START_OF_BRACKET + '/' + type + END_OF_BRACKET;
};

export default (selector: csstree.Selector) => {
  if (!selector) {
    throw new Error('1 argument required, but only 0 present.');
  }

  if (selector.type !== 'Selector') {
    throw new Error(`Bad node type ${selector.type} for 'generateRegexString'.`);
  }

  const result: {
    type: 'ClassSelector' | 'IdSelector' | 'AttributeSelector' | 'WhiteSpace' | 'TypeSelector';
    value: string;
  }[] = [];

  csstree.walk(selector, (node) => {
    switch (node.type) {
      case 'ClassSelector':
        result.push({
          type: node.type,
          value: attributeRegexp(CLASS_ATTRIBUTE, node.name),
        });
        break;

      case 'IdSelector':
        result.push({
          type: node.type,
          value: attributeRegexp(ID_ATTRIBUTE, node.name),
        });
        break;

      case 'AttributeSelector':
        result.push({
          type: node.type,
          value: attributeRegexp(node.name.name, (node.value as csstree.Identifier).name),
        });
        break;

      case 'TypeSelector':
        result.push({
          type: node.type,
          value: openingTagRegexp(node.name),
        });
        break;

      case 'WhiteSpace':
        result.push({
          type: node.type,
          value: END_OF_BRACKET + SPACE_BETWEEN_ELEMENT + START_OF_BRACKET + TYPE_NAME + ATTRIBUTE_SEPARATOR,
        });
        break;

      case 'Combinator':
        if (node.name === '>' || node.name === '+' || node.name === '~') {
          throw new Error(`Combinator "${node.name}" is not supported.`);
        }
        break;

      case 'PseudoElementSelector':
        throw new Error('Pseudo-elements "before" or "after" is not supported.');
        break;

      default:
        break;
    }
  });

  return result.map((selector) => selector.value).join('');
};

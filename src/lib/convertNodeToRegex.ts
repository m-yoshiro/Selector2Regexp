import { IdOrClassSelector } from '../../types';

const translation = {
  ClassSelector: 'class',
  IdSelector: 'id',
};

export default (node: IdOrClassSelector) => {
  if (!node) {
    throw new Error('1 argument required, but only 0 present.');
  }

  if (!(node.type in translation)) {
    throw new Error(`Bad node type ${node.type} for 'generateRegexString'. should be ${Object.keys(translation).join(', ')}`);
  }

  const selector = node.name;
  const attribute = translation[node.type];

  return `${attribute}=(['"])\s?(${selector})\s?\1`;
};

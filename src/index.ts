import { parse } from './lib/parse';
import { generate } from './lib/generate/generate';
import { convert } from './lib/convert/convert';
import { CSSSelectorString } from '../types';

export default function selector2Regexp(data: CSSSelectorString) {
  if (!data) {
    throw new Error('1 argument required, but only 0 present.');
  }
  const selectorNode = parse(data);
  const ast = convert(selectorNode);

  return generate(ast);
}

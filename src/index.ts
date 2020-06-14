import { parse } from './lib/parse';
import { transformToRegexp } from './lib/transformToRegexp';
import { CSSSelectorString } from '../types';

export default function (data: CSSSelectorString) {
  if (!data) {
    throw new Error('1 argument required, but only 0 present.');
  }
  const selectorNode = parse(data);

  return transformToRegexp(selectorNode);
}

import getSelectorNodes from './lib/getSelectorNodes';
import generateRegexString from './lib/generateRegexString';
import { CSSSelectorString } from '../types';

class CssSearchSelector {
  constructor() {}

  get version(): string {
    return '';
  }

  convert(data: CSSSelectorString) {
    if (!data) {
      throw new Error('1 argument required, but only 0 present.');
    }
    const nodes = getSelectorNodes(data);

    return nodes.map((node) => generateRegexString(node));
  }
}

export function cssSearchSelector(data: CSSSelectorString) {
  if (!data) {
    throw new Error('1 argument required, but only 0 present.');
  }
  const nodes = getSelectorNodes(data);

  return nodes.map((node) => generateRegexString(node));
}

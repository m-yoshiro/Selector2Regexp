import getSelectorNodes from './lib/getSelectorNodes';
import generateRegexString from './lib/generateRegexString';

import { ICssSearchSelector } from '../types';

class CssSearchSelector implements ICssSearchSelector {
  private data: any;
  constructor(data: any) {
    this.data = data;
  }

  get version(): string {
    return '';
  }

  run() {}
}

export function cssSearchSelector(data) {
  if (!data) {
    throw new Error('1 argument required, but only 0 present.');
  }
  const nodes = getSelectorNodes(data);
  const result = nodes.map(node => generateRegexString(node));

  return result;
}

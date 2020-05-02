import convertStringToNodes from './lib/convertStringToNodes';
import convertNodeToRegex from './lib/convertNodeToRegex';
import { CSSSelectorString } from '../types';

export default function selector2Regex(data: CSSSelectorString) {
  if (!data) {
    throw new Error('1 argument required, but only 0 present.');
  }
  const selectorNodes = convertStringToNodes(data);

  return selectorNodes && selectorNodes.map((node) => convertNodeToRegex(node!));
}

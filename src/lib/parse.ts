import csstree from 'css-tree';
import { CSSSelectorString } from '../../types';

export const parse = (selectorString: CSSSelectorString) => {
  try {
    return csstree.parse(selectorString.trim(), {
      context: 'selector',
      onParseError: (error) => {
        console.log(error.message);
      },
    }) as csstree.Selector;
  } catch (error) {
    throw error;
  }
};

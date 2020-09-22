import { Element } from '../src/lib/node/element';
import { Combinator } from '../src/lib/node/combinator';
import csstree, { Selector } from 'css-tree';

const attr = {
  name: 'class',
  value: [
    {
      value: 'button',
    },
  ],
};

const attr2 = {
  name: 'class',
  value: [
    {
      value: 'button',
    },
    {
      value: 'warning',
    },
  ],
};

describe('Element', () => {
  it('Add attribute', () => {
    const s2rElm = new Element();
  });
});

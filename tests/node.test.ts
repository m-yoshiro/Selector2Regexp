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

    s2rElm.addAttr(attr);
    expect(s2rElm.attributes!.length).toEqual(1);

    s2rElm.addAttr(attr2);
    expect(s2rElm.attributes!.length).toEqual(2);
  });

  it('Ignore duplicated values', () => {
    const s2rElm = new Element();

    s2rElm.addAttr({
      name: 'class',
      value: [
        {
          value: 'button',
        },
        {
          value: 'button',
        },
      ],
    });
    expect(s2rElm.attributes[0]).toEqual({ name: 'class', value: [{ value: 'button' }] });
  });

  it('Various attributes', () => {
    const s2rElm = new Element();

    s2rElm.addAttr({
      name: 'class',
      value: [
        {
          value: 'button',
        },
      ],
    });
    s2rElm.addAttr({
      name: 'id',
      value: [
        {
          value: 'section',
        },
      ],
    });
    expect(s2rElm.attributes).toEqual([
      {
        name: 'class',
        value: [{ value: 'button' }],
      },
      {
        name: 'id',
        value: [{ value: 'section' }],
      },
    ]);
  });
});

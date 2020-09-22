import { generate } from '../src/lib/generate/generate';
import { attributeToRegexp } from '../src/lib/generate/attributeGenerate';
import csstree from 'css-tree';
import { Element } from '../src/lib/node/element';
import { Combinator } from '../src/lib/node/combinator';
import { Selector } from '../src/lib/node/selector';
import { Attribute } from '../types';

import { makeTest } from './util';

describe('Attribute', () => {
  it('class', () => {
    expect(attributeToRegexp({ name: 'class', value: 'button' })).toEqual(1);
  });
});

describe('Generate', () => {
  it('SelectorList has a child', () => {
    const testCas = makeTest({
      attr: {
        name: 'class',
        value: 'example',
      },
    });
    console.log(testCas);

    expect(testCas).toMatch(/class/);
    expect(testCas).toMatch(/example/);
  });
});

import { generate } from '../src/lib/generate/generate';
import { attributeToRegexp } from '../src/lib/generate/attributeGenerate';
import csstree from 'css-tree';
import { Element } from '../src/lib/node/element';
import { Combinator } from '../src/lib/node/combinator';
import { Selector } from '../src/lib/node/selector';
import { Attribute } from '../types';

const makeTest = (attr: Attribute) => {
  const selector = new Selector();
  const element = new Element();
  element.addAttr({
    name: 'class',
    value: [{ value: 'example' }],
  });
  selector.add(element);
  return new RegExp(generate(selector));
};

describe('Attribute', () => {
  it('class', () => {
    expect(attributeToRegexp('class', [{ value: 'button' }])).toEqual(1);
  });
});

describe('Generate', () => {
  it('SelectorList has a child', () => {
    const testCas = makeTest({
      name: 'class',
      value: [{ value: 'example' }],
    });
    console.log(testCas);

    expect(testCas).toMatch(/class/);
    expect(testCas).toMatch(/example/);
  });
});

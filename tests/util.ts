import { generate } from '../src/lib/generate/generate';
import { Element } from '../src/lib/node/element';
import { Combinator } from '../src/lib/node/combinator';
import { Selector } from '../src/lib/node/selector';
import { Attribute } from '../types';
import { combinatorGenerate } from '../src/lib/generate/combinatorGenerate';

type TestElement = {
  attr?: Attribute;
  tagName?: string;
};

interface TestCombinator {
  name: string;
}

export const makeTest = (data: TestElement, debug?: boolean) => {
  const selector = new Selector();

  const { attr, tagName } = data;
  const element = new Element();
  if (attr) {
    element.addAttr(attr);
  }
  if (tagName) {
    element.tagName = tagName;
  }

  selector.add(element);

  const result = generate(selector);
  if (debug) {
    console.log(result);
  }
  return new RegExp(result);
};

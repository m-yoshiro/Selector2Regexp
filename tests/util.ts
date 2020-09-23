import { generate } from '../src/lib/generate/generate';
import { Element } from '../src/lib/node/element';
import { Combinator } from '../src/lib/node/combinator';
import { Selector } from '../src/lib/node/selector';
import { Attribute } from '../types';
import { combinatorGenerate } from '../src/lib/generate/combinatorGenerate';

type TestElement = {
  classList?: string[];
  id?: string;
  attr?: Attribute;
  tagName?: string;
};

export const makeTest = (data: TestElement, debug?: boolean) => {
  const selector = new Selector();

  const { classList, id, attr, tagName } = data;
  const element = new Element();
  if (attr) {
    element.addAttr(attr);
  }
  if (tagName) {
    element.tagName = tagName;
  }
  if (classList) {
    element.classList.push(...classList);
  }
  if (id) {
    element.id = id;
  }

  selector.add(element);

  const result = generate(selector);
  if (debug) {
    console.log(result);
  }
  return new RegExp(result);
};

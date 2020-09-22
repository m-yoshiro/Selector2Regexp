import { generate } from '../src/lib/generate/generate';
import { Element } from '../src/lib/node/element';
import { Selector } from '../src/lib/node/selector';
import { Attribute } from '../types';

export const makeTest = (data: { attr?: Attribute; tagName?: string }, debug?: boolean) => {
  const { attr, tagName } = data;
  const selector = new Selector();
  const element = new Element();
  element.addAttr(attr);
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

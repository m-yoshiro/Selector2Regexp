import { S2rNode } from './abstractNode';
import { Combinator } from './combinator';
import { Element } from './element';

export class Selector extends S2rNode {
  children: (Element | Combinator)[];

  constructor() {
    super();
    this.type = 'Selector';
    this.children = [];
  }

  add(children: (Element | Combinator) | (Element | Combinator)[]) {
    if (Array.isArray(children)) {
      this.children.push(...children);
    } else {
      this.children.push(children);
    }
  }
}

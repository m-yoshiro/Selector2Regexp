import csstree from 'css-tree';
import { S2rNode } from './abstractNode';

export class Combinator extends S2rNode {
  name: string;

  constructor(name: string) {
    super();
    this.type = 'Combinator';
    this.name = name;
  }
}

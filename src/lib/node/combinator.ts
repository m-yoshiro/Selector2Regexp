import csstree from 'css-tree';
import { S2rNode } from './abstractNode';

export class Combinator extends S2rNode {
  name: string;

  constructor() {
    super();
    this.type = 'Combinator';
    this.name = '';
  }

  add(ast: csstree.Combinator | csstree.WhiteSpace) {
    if (ast.type === 'Combinator') {
      this.name = ast.name;
    } else {
      this.name = ast.type;
    }
  }
}

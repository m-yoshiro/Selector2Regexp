import csstree from 'css-tree';
import { S2rNode } from './abstractNode';

export class Element extends S2rNode {
  tagName?: csstree.TypeSelector['name'];
  attributes: {
    name: string | csstree.Identifier;
    value: string | null | csstree.AttributeSelector['value'];
    matcher?: string | null;
  }[];

  constructor() {
    super();
    this.type = 'Element';
    this.attributes = [];
  }

  add(ast: csstree.CssNode) {
    if (ast.type === 'ClassSelector') {
      this.attributes?.push({
        name: 'class',
        value: ast.name,
      });
    } else if (ast.type === 'IdSelector') {
      this.attributes?.push({
        name: 'id',
        value: ast.name,
      });
    } else if (ast.type === 'TypeSelector') {
      this.tagName = ast.name;
    } else if (ast.type === 'AttributeSelector') {
      const { name, value, matcher } = ast;
      this.attributes?.push({
        name,
        value,
        matcher,
      });
    }
  }
}

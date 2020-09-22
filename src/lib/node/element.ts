import { Attribute } from '../../../types';
import { S2rNode } from './abstractNode';
import equal from 'deep-equal';

export class Element extends S2rNode {
  _tagName: string | null;
  attributes: Attribute[];

  constructor() {
    super();
    this.type = 'Element';
    this._tagName = null;
    this.attributes = [];
  }

  set tagName(name: string | null) {
    this._tagName = name;
  }

  get tagName() {
    return this._tagName;
  }

  addAttr(attr: Attribute) {
    if (!this.isDuplicatedAttr(attr)) {
      this.attributes.push(attr);
    }
  }

  private isDuplicatedAttr(attr: Attribute): boolean {
    return this.attributes.some((item) => equal(item, attr));
  }

  findIndexAttr(attrName: string) {
    return this.attributes.findIndex((item) => attrName in item);
  }
}

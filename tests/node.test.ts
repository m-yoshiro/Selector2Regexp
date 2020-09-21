import { Element } from '../src/lib/node/element';
import { Combinator } from '../src/lib/node/combinator';
import csstree, { Selector } from 'css-tree';

describe('Element', () => {
  it('S2r', () => {
    const s2rElm = new Element();
    const ast = csstree.parse('.example > .test', { context: 'selector' });
    const ast2 = csstree.parse('.next', { context: 'selector' });

    s2rElm.add((ast as Selector).children.first() as csstree.ClassSelector);
    s2rElm.add((ast2 as Selector).children.first() as csstree.ClassSelector);

    expect(s2rElm.attributes!.length).toEqual(2);
  });
});

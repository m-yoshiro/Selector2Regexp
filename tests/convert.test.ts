import { convert } from '../src/lib/convert/convert';
import csstree from 'css-tree';

describe('Convert', () => {
  it('SelectorList has a child', () => {
    const ast = csstree.parse('.example > .test', { context: 'selectorList' });
    const result = convert(ast);
    console.log(result);

    expect(Array.isArray(result) && result.length).toEqual(1);
  });

  it('SelectorList has any children', () => {
    const ast = csstree.parse('.example > .test, .parent > .child', { context: 'selectorList' });
    const result = convert(ast);
    console.log(result);

    expect(Array.isArray(result) && result.length).toEqual(2);
  });
});

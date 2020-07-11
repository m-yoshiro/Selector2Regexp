import { parse } from '../src/lib/parse';
import csstree from 'css-tree';

describe('convertToNodes', () => {
  it('with class selector', () => {
    expect(parse('.example')).toStrictEqual(csstree.parse('.example', { context: 'selector' }));
  });

  it('with ID selector', () => {
    expect(parse('#example')).toStrictEqual(csstree.parse('#example', { context: 'selector' }));
  });

  it('with multiple selector', () => {
    expect(parse('.example .child')).toStrictEqual(csstree.parse('.example .child', { context: 'selector' }));
  });
});

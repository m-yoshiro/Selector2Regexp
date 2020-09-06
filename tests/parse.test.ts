import { parse } from '../src/lib/parse';
import csstree from 'css-tree';

describe('convertToNodes', () => {
  it('with class selector', () => {
    expect(parse('.example')).toStrictEqual(csstree.parse('.example', { context: 'selectorList' }));
  });

  it('with ID selector', () => {
    expect(parse('#example')).toStrictEqual(csstree.parse('#example', { context: 'selectorList' }));
  });

  it('with multiple selector', () => {
    expect(parse('.example .child')).toStrictEqual(csstree.parse('.example .child', { context: 'selectorList' }));
  });

  it('with selector list', () => {
    expect(parse('.example-a, .example-b')).toStrictEqual(csstree.parse('.example-a, .example-b', { context: 'selectorList' }));
  });
});

import convertToNodes from '../src/lib/convertToNodes';
import csstree from 'css-tree';

describe('convertToNodes', () => {
  it('with selector', () => {
    expect(convertToNodes('.example')).toBe(csstree.parse('.example'));
    expect(convertToNodes('#example')).toBe(csstree.parse('#example'));
  });
});

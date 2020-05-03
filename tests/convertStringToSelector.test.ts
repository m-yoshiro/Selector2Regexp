import convertStringToSelector from '../src/lib/convertStringToSelector';
import csstree from 'css-tree';

describe('convertToNodes', () => {
  it('with class selector', () => {
    expect(convertStringToSelector('.example')).toStrictEqual(csstree.parse('.example', { context: 'selector' }));
  });

  it('with ID selector', () => {
    expect(convertStringToSelector('#example')).toStrictEqual(csstree.parse('#example', { context: 'selector' }));
  });

  it('with multiple selector', () => {
    expect(convertStringToSelector('.example .child')).toStrictEqual(csstree.parse('.example .child', { context: 'selector' }));
  });
});

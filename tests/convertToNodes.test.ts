import convertToNodes from '../src/lib/convertToNodes';

describe('convertToNodes', () => {
  it('with class selector', () => {
    expect(convertToNodes('.example')).toStrictEqual([{ loc: null, name: 'example', type: 'ClassSelector' }]);
  });
  it('with ID selector', () => {
    expect(convertToNodes('#example')).toStrictEqual([{ loc: null, name: 'example', type: 'IdSelector' }]);
  });

  it('with multiple selector', () => {
    expect(convertToNodes('.example .child')).toStrictEqual([
      { loc: null, name: 'example', type: 'ClassSelector' },
      { loc: null, name: 'child', type: 'ClassSelector' },
    ]);
  });
});

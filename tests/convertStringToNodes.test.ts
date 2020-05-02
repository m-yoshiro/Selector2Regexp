import convertStringToNodes from '../src/lib/convertStringToNodes';

describe('convertToNodes', () => {
  it('with class selector', () => {
    expect(convertStringToNodes('.example')).toStrictEqual([{ loc: null, name: 'example', type: 'ClassSelector' }]);
  });
  it('with ID selector', () => {
    expect(convertStringToNodes('#example')).toStrictEqual([{ loc: null, name: 'example', type: 'IdSelector' }]);
  });

  it('with multiple selector', () => {
    expect(convertStringToNodes('.example .child')).toStrictEqual([
      { loc: null, name: 'example', type: 'ClassSelector' },
      { loc: null, name: 'child', type: 'ClassSelector' },
    ]);
  });

  it('with selector and block', () => {
    expect(() => convertStringToNodes('.example .list;')).toThrowError('Unexpected input');
    expect(() => convertStringToNodes('color: red;')).toThrowError('Identifier is expected');
  });
});

import convertStringToSelector from '../src/lib/convertStringToSelector';

describe('convertToNodes', () => {
  it('with class selector', () => {
    expect(convertStringToSelector('.example')).toStrictEqual([{ loc: null, name: 'example', type: 'ClassSelector' }]);
  });
  it('with ID selector', () => {
    expect(convertStringToSelector('#example')).toStrictEqual([{ loc: null, name: 'example', type: 'IdSelector' }]);
  });

  it('with multiple selector', () => {
    expect(convertStringToSelector('.example .child')).toStrictEqual([
      { loc: null, name: 'example', type: 'ClassSelector' },
      { loc: null, name: 'child', type: 'ClassSelector' },
    ]);
  });

  it('with selector and block', () => {
    expect(() => convertStringToSelector('.example .list;')).toThrowError('Unexpected input');
    expect(() => convertStringToSelector('color: red;')).toThrowError('Identifier is expected');
  });
});

import getSelectorNodes from '../src/lib/convertToNodes';

describe('getSelector', () => {
  it('with className selector', () => {
    const node = getSelectorNodes('.example')[0];
    expect(node.name).toEqual('example');
    expect(node.type).toEqual('ClassSelector');
  });

  it('with Id selector', () => {
    const node = getSelectorNodes('#example')[0];
    expect(node.name).toEqual('example');
    expect(node.type).toEqual('IdSelector');
  });
});

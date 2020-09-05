import { attributeRegexp } from '../src/lib/visitor/utils';

describe('attributeRegexp', () => {
  it('One argument', () => {
    expect(attributeRegexp('class')).toEqual('class');
  });
});

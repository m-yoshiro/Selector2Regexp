import { attributeRegexp } from '../src/lib/visitor/utils';

describe('attributeRegexp', () => {
  it('One arg', () => {
    expect(attributeRegexp('class')).toEqual('class');
  });
});

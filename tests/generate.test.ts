import { makeTest } from './util';

describe('Generate', () => {
  it('SelectorList has a child', () => {
    const testCas = makeTest({
      attr: {
        name: 'class',
        value: 'example',
      },
    });
    expect(testCas.toString()).toMatch(/class/);
    expect(testCas.toString()).toMatch(/example/);
  });
});

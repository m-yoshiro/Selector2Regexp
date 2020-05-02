import convertNodeToRegex from '../src/lib/convertNodeToRegex';
import csstree from 'css-tree';

describe('generateRegexString()', () => {
  it('with className selector', () => {
    const node: csstree.ClassSelector = {
      type: 'ClassSelector',
      name: 'example',
    };

    expect(convertNodeToRegex(node)).toBe('class=[\'"]s?(example)s?[\'"]');
  });
});

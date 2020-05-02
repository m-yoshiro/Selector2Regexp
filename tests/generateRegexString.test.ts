import generateRegexString from '../src/lib/generateRegexString';
import csstree from 'css-tree';

describe('generateRegexString()', () => {
  it('with className selector', () => {
    const node: csstree.ClassSelector = {
      type: 'ClassSelector',
      name: 'example',
    };

    expect(generateRegexString(node)).toBe('class=[\'"]s?(example)s?[\'"]');
  });
});

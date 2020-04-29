import generateRegexString from '../src/lib/generateRegexString';
import csstree from 'css-tree';

const ast = csstree.parse('.example', {
  context: 'selector',
  onParseError: (error) => {
    console.log(error.message);
  },
});

describe('generateRegexString()', () => {
  it('throw an error without an argument', () => {
    expect(() => {
      generateRegexString();
    }).toThrow(Error);

    expect(() => {
      generateRegexString({
        name: 'example',
        type: 'Selector',
      });
    }).toThrow(Error);
  });

  it('with className selector', () => {
    const node = {
      name: 'example',
      type: 'ClassSelector',
    };

    expect(generateRegexString(node)).toBe('class=[\'"]s?(example)s?[\'"]');
  });
});

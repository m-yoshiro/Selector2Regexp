const generateRegexString = require('./../lib/generateRegexString');

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

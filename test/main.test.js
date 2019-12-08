const TestRunner = require('jest-runner');
const cssSearchAdviser = require('./../main');

describe('initialize', () => {
  it('throw an error without an argument', () => {
    expect(() => {
      cssSearchAdviser();
    }).toThrow(Error);
  });

  it('with class selector', () => {
    const regexStr = cssSearchAdviser('.example')[0];
    const pattern = new RegExp(regexStr);

    expect(regexStr).toBe('class=[\'"]s?(example)s?[\'"]');
    expect(pattern.test('class="example"')).toBeTruthy();
    expect(pattern.test('<div class="example">example</div>')).toBeTruthy();

    expect(pattern.test('class="exampleTest"')).toBeFalsy();
    expect(pattern.test('<div class="exampleTest">example</div>')).toBeFalsy();
  });

  it('with id selector', () => {
    const regexStr = cssSearchAdviser('#example')[0];
    const pattern = new RegExp(regexStr);

    expect(regexStr).toBe('id=[\'"]s?(example)s?[\'"]');
    expect(pattern.test('id="example"')).toBeTruthy();
    expect(pattern.test('id="exampleTest"')).toBeFalsy();
  });
});

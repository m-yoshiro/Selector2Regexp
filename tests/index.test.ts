import selector2Regex from '../src/index';

describe('initialize', () => {
  it('with class selector', () => {
    const regexStr = selector2Regex('.example')[0];
    const pattern = new RegExp(regexStr);

    expect(regexStr).toBe('class=[\'"]s?(example)s?[\'"]');
    expect(pattern.test('class="example"')).toBeTruthy();
    expect(pattern.test('<div class="example">example</div>')).toBeTruthy();

    expect(pattern.test('class="exampleTest"')).toBeFalsy();
    expect(pattern.test('<div class="exampleTest">example</div>')).toBeFalsy();
  });

  it('with id selector', () => {
    const regexStr = selector2Regex('#example')[0];
    const pattern = new RegExp(regexStr);

    expect(regexStr).toBe('id=[\'"]s?(example)s?[\'"]');
    expect(pattern.test('id="example"')).toBeTruthy();
    expect(pattern.test('id="exampleTest"')).toBeFalsy();
  });
});

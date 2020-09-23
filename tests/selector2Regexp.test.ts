import selector2Regexp from '../src/index';

describe('Selector2Regexp', () => {
  it('Class', () => {
    const testCase = new RegExp(selector2Regexp('.button'));
    expect(
      testCase.test(`
        <div class="button"></div>
      `)
    ).toBeTruthy();
  });

  it('Type', () => {
    const testCase = new RegExp(selector2Regexp('button'));
    expect(
      testCase.test(`
        <button class="bom"></button>
      `)
    ).toBeTruthy();
  });
});

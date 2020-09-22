import { makeTest } from './util';

describe('Matching', () => {
  describe('ClassSelector', () => {
    const testCase = makeTest({
      attr: {
        name: 'class',
        value: 'example',
      },
    });

    it('Should match', () => {
      expect(testCase.test(`<div class="example"></div>`)).toBeTruthy();
    });

    it('Should NOT match wrong classes', () => {
      expect(testCase.test(`<div class="xample"></div>`)).toBeFalsy();
    });

    describe('a class with any spaces', () => {
      it('Should match', () => {
        expect(testCase.test(`<div class=" example"></div>`)).toBeTruthy();
        expect(testCase.test(`<div class="example "></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(testCase.test(`<div class="exa mple"></div>`)).toBeFalsy();
      });
    });

    describe('a class with any values', () => {
      it('Should match', () => {
        expect(testCase.test(`<div class="left example"></div>`)).toBeTruthy();
        expect(testCase.test(`<div class="example right"></div>`)).toBeTruthy();
        expect(testCase.test(`<div class="left example right"></div>`)).toBeTruthy();
      });

      it('Should NOT match whenever match a part of wrong string', () => {
        expect(testCase.test(`<div class="leftexample"></div>`)).toBeFalsy();
        expect(testCase.test(`<div class="left exampleright"></div>`)).toBeFalsy();
      });
    });
  });

  describe('ID selector', () => {
    const testCase = makeTest({
      attr: {
        name: 'id',
        value: 'idTest',
      },
    });

    it('Should match the id', () => {
      expect(testCase.test(`<div id="idTest"></div>`)).toBeTruthy();
      expect(testCase.test(`<div id="left idTest"></div>`)).toBeTruthy();
      expect(testCase.test(`<div id="left idTest right"></div>`)).toBeTruthy();
    });
  });

  describe('Attribute selector', () => {
    describe('Attribute without any value', () => {
      const testCase = makeTest({
        attr: {
          name: 'class',
          value: 'example',
        },
      });

      it('Should match', () => {
        expect(testCase.test(`<div hidden></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(testCase.test(`<div data-state></div>`)).toBeFalsy();
      });
    });

    describe('Matcher "="', () => {
      const testCaseWithSingleValue = makeTest({
        attr: {
          name: 'data-state',
          value: 'active',
          matcher: '=',
        },
      });

      const testCaseWithMultipleValues = makeTest({
        attr: {
          name: 'data-state',
          value: 'super active',
          matcher: '=',
        },
      });

      it('Should match', () => {
        expect(testCaseWithSingleValue.test(`<div data-state="active"></div>`)).toBeTruthy();
        expect(testCaseWithMultipleValues.test(`<div data-state="super active"></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(testCaseWithSingleValue.test(`<div data-state="super active"></div>`)).toBeFalsy();
        expect(testCaseWithMultipleValues.test(`<div data-state="active super"></div>`)).toBeFalsy();
      });
    });

    describe('Matcher "*="', () => {
      const testCase = makeTest({
        attr: {
          name: 'data-state',
          value: 'active',
          matcher: '*=',
        },
      });

      it('Should match', () => {
        expect(testCase.test(`<div data-state="super-active"></div>`)).toBeTruthy();
        expect(testCase.test(`<div data-state="super active"></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(testCase.test(`<div data-test="super-active"></div>`)).toBeFalsy();
      });
    });

    describe('Matcher "^="', () => {
      const testCase = makeTest({
        attr: {
          name: 'class',
          value: 'button',
          matcher: '^=',
        },
      });

      it('Should match', () => {
        expect(testCase.test(`<div class="button-small"></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(testCase.test(`<div class="super-button"></div>`)).toBeFalsy();
      });

      describe('when selector has double quotes', () => {
        const testCase = makeTest({
          attr: {
            name: 'class',
            value: 'button',
            matcher: '^=',
          },
        });

        const testCaseWithQuote = makeTest({
          attr: {
            name: 'class',
            value: '"button"',
            matcher: '^=',
          },
        });

        it('Should be equal', () => {
          expect(testCaseWithQuote.toString()).toEqual(testCase.toString());
        });

        it('Should match', () => {
          expect(testCaseWithQuote.test(`<div class="button-small"></div>`)).toBeTruthy();
        });

        it('Should NOT match', () => {
          expect(testCaseWithQuote.test(`<div class="super-button"></div>`)).toBeFalsy();
        });
      });
    });

    describe('Matcher "$="', () => {
      const testCase = makeTest({
        attr: {
          name: 'class',
          value: 'box',
          matcher: '$=',
        },
      });

      it('Should match', () => {
        expect(testCase.test(`<div class="super-box"></div>`)).toBeTruthy();
      });
      it('Should NOT match', () => {
        expect(testCase.test(`<div class="box-super"></div>`)).toBeFalsy();
      });
    });

    describe('Matcher "~="', () => {
      const testCase = makeTest({
        attr: {
          name: 'class',
          value: 'one',
          matcher: '~=',
        },
      });

      it('Should match', () => {
        expect(testCase.test(`<div class="some one any"></div>`)).toBeTruthy();
      });
      it('Should NOT match', () => {
        expect(testCase.test(`<div class="someone any"></div>`)).toBeFalsy();
      });
    });

    describe('Type selector', () => {
      const testCaseDiv = makeTest({
        tagName: 'div',
      });
      const testCaseA = makeTest({
        tagName: 'a',
      });

      it('Should match', () => {
        expect(testCaseDiv.test(`<div id="app"></div>`)).toBeTruthy();
        expect(testCaseDiv.test(`<div id="app" class="sample"></div>`)).toBeTruthy();
      });

      it('Should match when a target is a child', () => {
        expect(testCaseA.test(`<div id="app" class="sample"><a href=""></a></div>`)).toBeTruthy();
      });
    });
  });
});

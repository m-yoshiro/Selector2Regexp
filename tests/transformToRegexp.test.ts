import transformToRegexp from '../src/lib/transformToRegexp';
import csstree from 'css-tree';

const selector = (str: string) =>
  csstree.parse(str, {
    context: 'selector',
  }) as csstree.Selector;

describe('generateRegexString()', () => {
  describe('ClassName selector', () => {
    const testCase = new RegExp(transformToRegexp(selector('.example')));

    describe('a class', () => {
      it('Should match', () => {
        expect(testCase.test(`<div class="example"></div>`)).toBeTruthy();
      });

      it('Should NOT match wrong classes', () => {
        expect(testCase.test(`<div class="xample"></div>`)).toBeFalsy();
      });
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
    const testCase = new RegExp(transformToRegexp(selector('#idTest')));

    it('Should match the id', () => {
      expect(testCase.test(`<div id="idTest"></div>`)).toBeTruthy();
      expect(testCase.test(`<div id="left idTest"></div>`)).toBeTruthy();
      expect(testCase.test(`<div id="left idTest right"></div>`)).toBeTruthy();
    });
  });

  describe('Attribute selector', () => {
    describe('Attribute without any value', () => {
      const testCase = new RegExp(transformToRegexp(selector('[hidden]')));

      it('Should match', () => {
        expect(testCase.test(`<div hidden></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(testCase.test(`<div data-state></div>`)).toBeFalsy();
      });
    });

    describe('Matcher "="', () => {
      const testCaseWithSingleValue = new RegExp(transformToRegexp(selector('[data-state=active]')));
      const testCaseWithMultipleValues = new RegExp(transformToRegexp(selector('[data-state="super active"]')));

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
      const testCase = new RegExp(transformToRegexp(selector('[data-state*=active]')));

      it('Should match', () => {
        expect(testCase.test(`<div data-state="super-active"></div>`)).toBeTruthy();
        expect(testCase.test(`<div data-state="super active"></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(testCase.test(`<div data-test="super-active"></div>`)).toBeFalsy();
      });
    });

    describe('Matcher "^="', () => {
      const testCase = new RegExp(transformToRegexp(selector('[class^=button]')));

      it('Should match', () => {
        expect(testCase.test(`<div class="button-small"></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(testCase.test(`<div class="super-button"></div>`)).toBeFalsy();
      });
    });

    describe('Matcher "$="', () => {
      const testCase = new RegExp(transformToRegexp(selector('[class$=box]')));

      it('Should match', () => {
        expect(testCase.test(`<div class="super-box"></div>`)).toBeTruthy();
      });
      it('Should NOT match', () => {
        expect(testCase.test(`<div class="box-super"></div>`)).toBeFalsy();
      });
    });

    describe('Matcher "~="', () => {
      const testCase = new RegExp(transformToRegexp(selector('[class~=one]')));

      it('Should match', () => {
        expect(testCase.test(`<div class="some one any"></div>`)).toBeTruthy();
      });
      it('Should NOT match', () => {
        expect(testCase.test(`<div class="someone any"></div>`)).toBeFalsy();
      });
    });
  });

  describe('Type selector', () => {
    const testCaseDiv = new RegExp(transformToRegexp(selector('div')));
    const testCaseA = new RegExp(transformToRegexp(selector('a')));

    it('Should match', () => {
      expect(testCaseDiv.test(`<div id="app"></div>`)).toBeTruthy();
      expect(testCaseDiv.test(`<div id="app" class="sample"></div>`)).toBeTruthy();
    });

    it('Should match when a target is child', () => {
      expect(testCaseA.test(`<div id="app" class="sample"><a href=""></a></div>`)).toBeTruthy();
    });
  });

  describe('Whitespace combinator', () => {
    it('To match generated regexp in HTML', () => {
      expect(new RegExp(transformToRegexp(selector('.example .child'))).test(`<div class="example"><div class="child"></div></div>`)).toBeTruthy();
      expect(
        new RegExp(transformToRegexp(selector('.example .second'))).test(`
          <div class="example">
            <div class="first"></div>
            <div class="second"></div>
            <div class="third"></div>
          </div>
        `)
      ).toBeTruthy();

      expect(
        new RegExp(transformToRegexp(selector('.example .second'))).test(`
          <div class="example">
            <div class="first"></div>
            <div><div class="second"></div></div>
            <div class="third"></div>
          </div>
        `)
      ).toBeTruthy();
    });
  });

  describe('Multiple selector', () => {
    describe('ClassSelectors', () => {
      it('To match generated regexp in HTML', () => {
        expect(new RegExp(transformToRegexp(selector('.button.button--primary'))).test(`<button class="button button--primary"></button>`)).toBeTruthy();
        expect(new RegExp(transformToRegexp(selector('.button.button--primary.button--small'))).test(`<button class="button button--primary button--small"></button>`)).toBeTruthy();
      });

      it('To be false', () => {
        expect(new RegExp(transformToRegexp(selector('.button .button--primary'))).test(`<button class="button button--primary"></button>`)).toBeFalsy();
      });
    });

    describe('TypeSelector with any selectors', () => {
      it('To match generated regexp in HTML', () => {
        expect(new RegExp(transformToRegexp(selector('div.panel'))).test(`<div class="panel"></div>`)).toBeTruthy();

        expect(new RegExp(transformToRegexp(selector('div.panel.panel--wide'))).test(`<div class="panel panel--wide"></div>`)).toBeTruthy();
      });

      it('To be false', () => {
        expect(new RegExp(transformToRegexp(selector('div.panel'))).test(`<section class="panel"></section>`)).toBeFalsy();
      });
    });
  });

  describe('Unsupported selector', () => {
    it('with ">", "+" and "~" Combinator throw Error', () => {
      expect(() => transformToRegexp(selector('.example > .child'))).toThrowError('Combinator ">" is not supported.');
      expect(() => transformToRegexp(selector('.example + .adjacentSibling'))).toThrowError('Combinator "+" is not supported.');
      expect(() => transformToRegexp(selector('.example ~ .sibling'))).toThrowError('Combinator "~" is not supported.');
    });

    it('with Pseudo-elements thtow Error', () => {
      expect(() => transformToRegexp(selector('.example::before'))).toThrowError('Pseudo-elements "before" or "after" is not supported.');
      expect(() => transformToRegexp(selector('.example::after'))).toThrowError('Pseudo-elements "before" or "after" is not supported.');
    });
  });
});

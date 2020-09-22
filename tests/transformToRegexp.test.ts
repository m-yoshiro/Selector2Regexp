import { transformToRegexp } from '../src/lib/transformToRegexp';
import csstree from 'css-tree';

const selector = (str: string) =>
  csstree.parse(str, {
    context: 'selectorList',
  }) as csstree.Selector;

describe.skip('generateRegexString()', () => {
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

      describe('when selector has double quotes', () => {
        const selectorStr = transformToRegexp(selector('[class^=button-]'));
        const selectorStrWithQuote = transformToRegexp(selector('[class^="button-"]'));
        const testCaseWithQuote = new RegExp(selectorStrWithQuote);

        it('Should be equal', () => {
          expect(selectorStrWithQuote).toEqual(selectorStr);
        });

        it('Should match', () => {
          expect(testCaseWithQuote.test(`<div class="button-small"></div>`)).toBeTruthy();
        });

        it('Should NOT match', () => {
          expect(testCaseWithQuote.test(`<div class="super-button"></div>`)).toBeFalsy();
          expect(testCaseWithQuote.test(`<div class="button"></div>`)).toBeFalsy();
        });
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

    it('Should match when a target is a child', () => {
      expect(testCaseA.test(`<div id="app" class="sample"><a href=""></a></div>`)).toBeTruthy();
    });
  });

  describe('Multiple selector', () => {
    describe('ClassSelectors', () => {
      it('Should match', () => {
        expect(new RegExp(transformToRegexp(selector('.button.button--primary'))).test(`<button class="button button--primary"></button>`)).toBeTruthy();
        expect(new RegExp(transformToRegexp(selector('.button.button--primary.button--small'))).test(`<button class="button button--primary button--small"></button>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(new RegExp(transformToRegexp(selector('.button.button--primary'))).test(`<button class="button"><span class="bad"></span></button>`)).toBeFalsy();
        expect(new RegExp(transformToRegexp(selector('.button.button--primary'))).test(`<button class="button--primary"><span class="bad"></span></button>`)).toBeFalsy();
      });
    });

    describe('TypeSelector with any selectors', () => {
      it('Should match', () => {
        expect(new RegExp(transformToRegexp(selector('div.panel'))).test(`<div class="panel"></div>`)).toBeTruthy();
        expect(new RegExp(transformToRegexp(selector('div.panel.panel--wide'))).test(`<div class="panel panel--wide"></div>`)).toBeTruthy();
      });

      it('Should NOT match', () => {
        expect(new RegExp(transformToRegexp(selector('div.panel'))).test(`<section class="panel"></section>`)).toBeFalsy();
      });
    });
  });

  // describe('Child combinator', () => {
  //   it('Should match', () => {
  //     expect(new RegExp(transformToRegexp(selector('.parent > .child'))).test(`<div class="parent"><div class="child"></div></div>`)).toBeTruthy();
  //   });

  //   it('Should NOT match', () => {
  //     expect(new RegExp(transformToRegexp(selector('.parent > .child'))).test(`<div class="parent"><div class="wrapper"><div class="child"></div></div></div>`)).toBeFalsy();
  //   });
  // });

  describe('Unsupported selector', () => {
    it('Throw Error with ">", "+" and "~" Combinator', () => {
      expect(() => transformToRegexp(selector('.parent > .child'))).toThrowError('Combinator ">" is not supported.');
      expect(() => transformToRegexp(selector('.example + .adjacentSibling'))).toThrowError('Combinator "+" is not supported.');
      expect(() => transformToRegexp(selector('.example ~ .sibling'))).toThrowError('Combinator "~" is not supported.');
    });

    it('Throw Error with Pseudo-elements', () => {
      expect(() => transformToRegexp(selector('.example::before'))).toThrowError('Pseudo-elements "before" or "after" is not supported.');
      expect(() => transformToRegexp(selector('.example::after'))).toThrowError('Pseudo-elements "before" or "after" is not supported.');
    });
  });

  describe('Selector List', () => {
    it('Throw Error', () => {
      expect(() => transformToRegexp(selector('.example-a, .example-b'))).toThrowError('SelectorList, like a ".example-a, .example-b", is not supported.');
    });
  });
});

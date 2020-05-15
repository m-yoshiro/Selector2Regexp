import transformToRegexp from '../src/lib/transformToRegexp';
import csstree from 'css-tree';

const selector = (str: string) =>
  csstree.parse(str, {
    context: 'selector',
  }) as csstree.Selector;

describe('generateRegexString()', () => {
  describe('ClassName selector', () => {
    it('Should be equal', () => {
      expect(transformToRegexp(selector('.example'))).toBe('class=[\'"]\\w*\\s*(?<!\\w)(example)(?!\\w)\\s*\\w*[\'"]');
    });

    it('To match generated regexp in HTML', () => {
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="example"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class=" example"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="example "></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="left example"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="example right"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="left example right"></div>`)).toBeTruthy();
    });

    it('Not to match', () => {
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="xample"></div>`)).toBeFalsy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="leftexample"></div>`)).toBeFalsy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="left exampleright"></div>`)).toBeFalsy();
    });
  });

  describe('ID selector', () => {
    it('Should be equal', () => {
      expect(transformToRegexp(selector('#app'))).toBe('id=[\'"]\\w*\\s*(?<!\\w)(app)(?!\\w)\\s*\\w*[\'"]');
    });

    it('To match generated regexp in HTML', () => {
      expect(new RegExp(transformToRegexp(selector('#app'))).test(`<div id="app"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('#app'))).test(`<div id="left app"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('#app'))).test(`<div id="left app right"></div>`)).toBeTruthy();
    });
  });

  describe('Attribute selector', () => {
    it('Should be equal', () => {
      expect(transformToRegexp(selector('[class=example]'))).toBe('class=[\'"]\\w*\\s*(?<!\\w)(example)(?!\\w)\\s*\\w*[\'"]');
      expect(transformToRegexp(selector('[data-id=modal]'))).toBe('data-id=[\'"]\\w*\\s*(?<!\\w)(modal)(?!\\w)\\s*\\w*[\'"]');
    });

    describe('Attribute name only', () => {
      it('return true', () => {
        expect(new RegExp(transformToRegexp(selector('[hidden]'))).test(`<div hidden></div>`)).toBeTruthy();
      });
      it('return false', () => {
        expect(new RegExp(transformToRegexp(selector('[hidden]'))).test(`<div data-state></div>`)).toBeFalsy();
      });
    });

    describe('*=', () => {
      it('return true', () => {
        expect(new RegExp(transformToRegexp(selector('[data-state*=active]'))).test(`<div data-state="super-active"></div>`)).toBeTruthy();
        expect(new RegExp(transformToRegexp(selector('[data-state*=active]'))).test(`<div data-state="super active"></div>`)).toBeTruthy();
      });
      it('return false', () => {
        expect(new RegExp(transformToRegexp(selector('[data-state*=active]'))).test(`<div data-test="super-active"></div>`)).toBeFalsy();
      });
    });

    describe('^=', () => {
      it('return true', () => {
        expect(new RegExp(transformToRegexp(selector('[class^=button]'))).test(`<div class="button-small"></div>`)).toBeTruthy();
      });
      it('return false', () => {
        expect(new RegExp(transformToRegexp(selector('[class^=button]'))).test(`<div class="super-button"></div>`)).toBeFalsy();
      });
    });

    describe('$=', () => {
      it('return true', () => {
        expect(new RegExp(transformToRegexp(selector('[class$=box]'))).test(`<div class="super-box"></div>`)).toBeTruthy();
      });
      it('return false', () => {
        expect(new RegExp(transformToRegexp(selector('[class$=box]'))).test(`<div class="box-super"></div>`)).toBeFalsy();
      });
    });

    describe('~=', () => {
      it('return true', () => {
        expect(new RegExp(transformToRegexp(selector('[class~=one]'))).test(`<div class="some one any"></div>`)).toBeTruthy();
      });
      it('return false', () => {
        expect(new RegExp(transformToRegexp(selector('[class~=one]'))).test(`<div class="someone any"></div>`)).toBeFalsy();
      });
    });
  });

  describe('Type selector', () => {
    it('Should be equal', () => {
      expect(transformToRegexp(selector('div'))).toBe('<\\s*(div)\\s*.*?\\s*>');
    });

    it('To match generated regexp in HTML', () => {
      expect(new RegExp(transformToRegexp(selector('div'))).test(`<div id="app"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('div'))).test(`<div id="app" class="sample"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('a'))).test(`<div id="app" class="sample"><a href=""></a></div>`)).toBeTruthy();
    });
  });

  describe('Whitespace combinator', () => {
    it('To match generated regexp in HTML', () => {
      // expect(transformToRegexp(selector('.example .child'))).toBe(' ['"]\w*\s*(?<!\w)(example)(?!\w)\s*\w*['"]\s*>\s*(?:\s<.*>.*\s*)*?<\s*\w+\s+class=['"]\w*\s*(?<!\w)(second)(?!\w)\s*\w*['"]');
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
        console.log(transformToRegexp(selector('div.panel')));
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

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
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="left example"></div>`)).toBeTruthy();
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
  });

  describe('Type selector', () => {
    it('Should be equal', () => {
      expect(transformToRegexp(selector('div'))).toBe('<\\s*div\\s*>');
    });
  });

  describe('Whitespace combinator', () => {
    it('To match generated regexp in HTML', () => {
      // expect(transformToRegexp(selector('.example .child'))).toBe(' ['"]\w*\s*(?<!\w)(example)(?!\w)\s*\w*['"]\s*>\s*(?:\s<.*>.*\s*)*?<\s*\w+\s+class=['"]\w*\s*(?<!\w)(second)(?!\w)\s*\w*['"]');
      expect(new RegExp(transformToRegexp(selector('.example .child'))).test(`<div class="example"><div class="child"></div></div>`)).toBeTruthy();
      console.log(transformToRegexp(selector('.example .second')));
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

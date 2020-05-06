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

    it('Find an given className in HTML', () => {
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="example"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="left example"></div>`)).toBeTruthy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="left example right"></div>`)).toBeTruthy();
    });

    it('Fail to find an given className in HTML', () => {
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="xample"></div>`)).toBeFalsy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="leftexample"></div>`)).toBeFalsy();
      expect(new RegExp(transformToRegexp(selector('.example'))).test(`<div class="left exampleright"></div>`)).toBeFalsy();
    });
  });

  describe('ID selector', () => {
    it('Should be equal', () => {
      expect(transformToRegexp(selector('#app'))).toBe('id=[\'"]\\w*\\s*(?<!\\w)(app)(?!\\w)\\s*\\w*[\'"]');
    });

    it('Find an given ID in HTML', () => {
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

  describe('Descendant – Whitespace – combinator', () => {
    it('with Descendant – Whitespace – Combinator', () => {
      // expect(convertNodeToRegex(selector('.example .child'))).toBe('class=[\'"]\\s?(example)\\s?[\'"]\\s*.*>\\s*<\\s*(\\w+)\\s*/>');
      console.log(transformToRegexp(selector('.example .child')));

      expect(new RegExp(transformToRegexp(selector('.example .child'))).test(`<div class="example"><div class="child"></div></div>`)).toBeTruthy();
    });

    it('Descendant valid regex', () => {
      const html = `<div class="example"><div class="child"></div></div>`;
      expect(new RegExp(transformToRegexp(selector('.example .child'))).test(html)).toBeTruthy();
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

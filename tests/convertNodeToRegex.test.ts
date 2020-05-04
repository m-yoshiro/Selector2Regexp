import convertNodeToRegex from '../src/lib/convertNodeToRegex';
import csstree from 'css-tree';

const selector = (str: string) =>
  csstree.parse(str, {
    context: 'selector',
  }) as csstree.Selector;

describe('generateRegexString()', () => {
  describe('given an ClassName selector', () => {
    it('Should be equal', () => {
      expect(convertNodeToRegex(selector('.example'))).toBe('class=[\'"]\\w*\\s*(?<!\\w)(example)(?!\\w)\\s*\\w*[\'"]');
    });

    it('Find an given className in HTML', () => {
      expect(new RegExp(convertNodeToRegex(selector('.example'))).test(`<div class="example"></div>`)).toBeTruthy();
      expect(new RegExp(convertNodeToRegex(selector('.example'))).test(`<div class="left example"></div>`)).toBeTruthy();
      expect(new RegExp(convertNodeToRegex(selector('.example'))).test(`<div class="left example right"></div>`)).toBeTruthy();
    });

    it('Fail to find an given className in HTML', () => {
      expect(new RegExp(convertNodeToRegex(selector('.example'))).test(`<div class="xample"></div>`)).toBeFalsy();
      expect(new RegExp(convertNodeToRegex(selector('.example'))).test(`<div class="leftexample"></div>`)).toBeFalsy();
      expect(new RegExp(convertNodeToRegex(selector('.example'))).test(`<div class="left exampleright"></div>`)).toBeFalsy();
    });
  });

  describe('given an ID selector', () => {
    it('Should be equal', () => {
      expect(convertNodeToRegex(selector('#app'))).toBe('id=[\'"]\\w*\\s*(app)\\s*\\w*[\'"]');
    });

    it('Find an given ID in HTML', () => {
      expect(new RegExp(convertNodeToRegex(selector('#app'))).test(`<div id="app"></div>`)).toBeTruthy();
      expect(new RegExp(convertNodeToRegex(selector('#app'))).test(`<div id="left app"></div>`)).toBeTruthy();
      expect(new RegExp(convertNodeToRegex(selector('#app'))).test(`<div id="left app right"></div>`)).toBeTruthy();
    });
  });

  describe('given an Attribute selector', () => {
    it('Should be equal', () => {
      expect(convertNodeToRegex(selector('[class=button]'))).toBe('class=[\'"]\\s?(button)\\s?[\'"]');
    });
  });

  describe('given an Descendant – Whitespace – combinator', () => {
    it('with Descendant – Whitespace – Combinator', () => {
      expect(convertNodeToRegex(selector('.example .child'))).toBe('class=[\'"]\\s?(example)\\s?[\'"]\\s*.*>\\s*<\\s*(\\w+)\\s*/>');
    });

    it('Descendant valid regex', () => {
      const html = `<div class="example"><div class="child"></div></div>`;
      console.log(html);
      expect(new RegExp(convertNodeToRegex(selector('.example .child'))).test(html)).toBeTruthy();
    });
  });

  describe('given an unsupported selector', () => {
    it('with ">", "+" and "~" Combinator throw Error', () => {
      expect(() => convertNodeToRegex(selector('.example > .child'))).toThrowError('Combinator ">" is not supported.');
      expect(() => convertNodeToRegex(selector('.example + .adjacentSibling'))).toThrowError('Combinator "+" is not supported.');
      expect(() => convertNodeToRegex(selector('.example ~ .sibling'))).toThrowError('Combinator "~" is not supported.');
    });

    it('with Pseudo-elements thtow Error', () => {
      expect(() => convertNodeToRegex(selector('.example::before'))).toThrowError('Pseudo-elements "before" or "after" is not supported.');
      expect(() => convertNodeToRegex(selector('.example::after'))).toThrowError('Pseudo-elements "before" or "after" is not supported.');
    });
  });
});

const TestRunner = require("jest-runner");
const cssSearchAdviser = require("./../main");
const getSelectorNodes = require("./../lib/getSelectorNodes");

describe("getSelector", () => {
  it('with className selector', () => {
    const node = getSelectorNodes('.example')[0];
    expect(node.name).toEqual('example');
    expect(node.type).toEqual('ClassSelector');
  })

  it('with Id selector', () => {
    const node = getSelectorNodes('#example')[0];
    expect(node.name).toEqual('example');
    expect(node.type).toEqual('IdSelector');
  })
});

describe("initialize", () => {
  it("throw an error without an argument", () => {
    expect(() => {
      cssSearchAdviser();
    }).toThrow(Error);
  });

  it("with class selector", () => {
    const regexStr = cssSearchAdviser(".example");
    const pattern = new RegExp(regexStr);

    expect(regexStr).toBe("class=['\"]s?(example)s?['\"]");
    expect(pattern.test('class="example"')).toBeTruthy();
    expect(pattern.test('class="exampleTest"')).toBeFalsy();
  });

  it("with id selector", () => {
    const regexStr = cssSearchAdviser("#example");
    const pattern = new RegExp(regexStr);

    expect(regexStr).toBe("id=['\"]s?(example)s?['\"]");
    expect(pattern.test('id="example"')).toBeTruthy();
    expect(pattern.test('id="exampleTest"')).toBeFalsy();
  });
});
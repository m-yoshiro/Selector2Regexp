import { makeTest } from './util';

import { generate } from '../src/lib/generate/generate';
import { Element } from '../src/lib/node/element';
import { Combinator } from '../src/lib/node/combinator';
import { Selector } from '../src/lib/node/selector';
import { Attribute } from '../types';
import { combinatorGenerate } from '../src/lib/generate/combinatorGenerate';

const whitespace = new Combinator('WhiteSpace');
const Child = new Combinator('>');
const AdjacentSibling = new Combinator('+');
const GeneralSibling = new Combinator('~');

describe('Match with combinator', () => {
  describe('Whitespace', () => {
    const selector = new Selector();
    const elementA = new Element();
    elementA.addAttr({
      name: 'class',
      value: 'parent',
    });
    const elementB = new Element();
    elementB.addAttr({
      name: 'class',
      value: 'child',
    });
    selector.add(elementA);
    selector.add(whitespace);
    selector.add(elementB);

    const testCase = new RegExp(generate(selector));

    it('Should match when HTML strings without any spaces or newline', () => {
      expect(testCase.test(`<div class="parent"><div class="child"></div></div>`)).toBeTruthy();
    });

    it('Should match when HTML strings with any spaces or newline', () => {
      expect(
        testCase.test(`
          <div class="parent">
            <div class="first"></div>
            <div class="second child"></div>
            <div class="third"></div>
          </div>
        `)
      ).toBeTruthy();
    });

    it('Should match when HTML strings with any children', () => {
      expect(
        testCase.test(`
          <div class="parent">
            <div class="first"></div>
            <div><div class="second child"></div></div>
            <div class="third"></div>
          </div>
        `)
      ).toBeTruthy();
    });

    it('Should NOT match', () => {
      expect(
        testCase.test(`
          <div class="parent">
            <div class="bad"></div>
          </div>
        `)
      ).toBeFalsy();

      expect(
        testCase.test(`
          <div class="parent child">
            <div class="bad"></div>
          </div>
        `)
      ).toBeFalsy();
    });
  });

  describe('Child combinator', () => {
    const selector = new Selector();
    const elementA = new Element();
    elementA.addAttr({
      name: 'class',
      value: 'parent',
    });
    const elementB = new Element();
    elementB.addAttr({
      name: 'class',
      value: 'child',
    });
    selector.add(elementA);
    selector.add(Child);
    selector.add(elementB);

    const testCase = new RegExp(generate(selector));
    console.log(testCase);

    it('Should match when HTML strings without any spaces or newline', () => {
      expect(testCase.test(`<div class="parent"><div class="child"></div></div>`)).toBeTruthy();
    });

    it('Should match when HTML strings with any spaces or newline', () => {
      expect(
        testCase.test(`
          <div class="parent">
            <div class="first child"></div>
            <div class="second"></div>
            <div class="third"></div>
          </div>
        `)
      ).toBeTruthy();

      expect(
        testCase.test(`
          <div class="parent">
            <div class="first"></div>
            <div class="second child"></div>
            <div class="third"></div>
          </div>
        `)
      ).toBeTruthy();
    });

    it('Should NOT match', () => {
      expect(
        testCase.test(`
          <div class="parent">
            <div class="bad"></div>
          </div>
        `)
      ).toBeFalsy();

      expect(
        testCase.test(`
          <div class="parent child">
            <div class="bad"></div>
          </div>
        `)
      ).toBeFalsy();

      expect(
        testCase.test(`
          <div class="parent">
            <div class="bad">
              <div class="child">
              </div>
            </div>
          </div>
        `)
      ).toBeFalsy();
    });
  });

  describe('Adjacent Sibling Combinator', () => {
    const selector = new Selector();
    const elementA = new Element();
    elementA.addAttr({
      name: 'class',
      value: 'older',
    });
    const elementB = new Element();
    elementB.addAttr({
      name: 'class',
      value: 'lower',
    });
    selector.add(elementA);
    selector.add(AdjacentSibling);
    selector.add(elementB);

    const testCase = new RegExp(generate(selector));
    console.log(testCase);

    it('Should match when HTML strings without any spaces or newline', () => {
      expect(testCase.test(`<div class="older"></div><div class="lower"></div>`)).toBeTruthy();
    });

    it('Should match when HTML strings with any spaces or newline', () => {
      expect(
        testCase.test(`
          <div class="parent">
            <div class="older"></div>
            <div class="lower"></div>
            <div class="third"></div>
          </div>
        `)
      ).toBeTruthy();
    });

    it('Should NOT match', () => {
      expect(
        testCase.test(`
          <div class="older">
            <div class="lower"></div>
          </div>
        `)
      ).toBeFalsy();

      expect(
        testCase.test(`
          <div class="parent child">
            <div class="lower"></div>
            <div class="older"></div>
          </div>
        `)
      ).toBeFalsy();

      expect(
        testCase.test(`
          <div class="parent">
            <div class="older"></div>
            <div class="middle"></div>
            <div class="lower"></div>
          </div>
        `)
      ).toBeFalsy();
    });
  });

  describe('General Sibling Combinator', () => {
    const selector = new Selector();
    const elementA = new Element();
    elementA.addAttr({
      name: 'class',
      value: 'leader',
    });
    const elementB = new Element();
    elementB.addAttr({
      name: 'class',
      value: 'follower',
    });
    selector.add(elementA);
    selector.add(GeneralSibling);
    selector.add(elementB);

    const testCase = new RegExp(generate(selector));
    console.log(testCase);

    it('Should match when HTML strings without any spaces or newline', () => {
      expect(testCase.test(`<div class="leader"></div><div class="follower"></div><div class="follower"></div>`)).toBeTruthy();
    });

    it('Should match when HTML strings with any spaces or newline', () => {
      expect(
        testCase.test(`
          <div class="parent">
            <div class="leader"></div>
            <div class="sub"></div>
            <div class="follower"></div>
          </div>
        `)
      ).toBeTruthy();
    });

    it('Should NOT match', () => {
      expect(
        testCase.test(`
          <div class="leader">
            <div class="follower"></div>
          </div>
        `)
      ).toBeFalsy();

      expect(
        testCase.test(`
          <div class="parent child">
            <div class="follower"></div>
            <div class="leader"></div>
          </div>
        `)
      ).toBeFalsy();

      expect(
        testCase.test(`
          <div class="leader"></div>
          <div class="su">
            <div class="sub"></div>
            <div class="follower"></div>
            <div class="sub"></div>
          </div>
        `)
      ).toBeFalsy();
    });
  });
});

import { Element } from '../node/element';
import { Combinator } from '../node/combinator';
import { Selector } from '../node/selector';
import { attributeToRegexp } from './attributeGenerate';
import { elementTemplate } from './elementGenerate';
import { combinatorGenerate } from './combinatorGenerate';

export const generate = (ast: Selector[] | Selector): string => {
  ast = Array.isArray(ast) ? ast : [ast];
  const result = [];

  for (const selector of ast) {
    const temp = selector.children.slice();
    const selectorResult = [];

    // Element
    for (const node of temp) {
      if (node instanceof Element) {
        // Traverse attributes
        let type = '';
        const attrTmp = [];
        let attrResult = '';

        // Generate Attributes regexp
        for (const attr of node.attributes) {
          attrTmp.push(attributeToRegexp(attr));
        }

        attrResult = (() => {
          if (attrTmp.length > 1) {
            return attrTmp.join('|') + `{${attrTmp.length}}`;
          } else {
            return attrTmp.join('');
          }
        })();

        // If tagName exist
        if (node._tagName) {
          type = node._tagName;
        }

        selectorResult.push(elementTemplate({ type: type, attributes: attrResult }));
      } else if (node instanceof Combinator) {
        selectorResult.push(node);
      }
    }

    // Genarate for Combinator
    for (const node of selectorResult) {
      if (node instanceof Combinator) {
        const index: number = selectorResult.indexOf(node);
        const ancestor: string | undefined | Combinator = selectorResult[index - 1];

        if (ancestor && typeof ancestor === 'string') {
          selectorResult[index] = combinatorGenerate(node.name, ancestor);
          delete selectorResult[index - 1];
        }
      }
    }

    result.push(selectorResult.join(''));
  }

  return result.join('|');
};

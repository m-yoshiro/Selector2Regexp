import { Element } from '../node/element';
import { Combinator } from '../node/combinator';
import { Selector } from '../node/selector';
import { attributeToRegexp, AttributeValue } from './attributeGenerate';
import { elementTemplate } from './elementGenerate';
import { combinatorGenerate } from './combinatorGenerate';

export const generate = (ast: Selector[] | Selector) => {
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
        const attrResults = [];
        const attributes: { [K: string]: AttributeValue[] } = {};
        let elementResult = '';

        // Preparing
        for (const attribute of node.attributes) {
          const name = typeof attribute.name === 'string' ? attribute.name : attribute.name.name;

          if (!attributes[name]) {
            attributes[name] = [];
          }

          const attrValue = ((value) => {
            if (typeof value === 'string') {
              return value;
            }

            if (value?.type === 'Identifier') {
              return value.name;
            }
          })(attribute.value);

          attributes[name].push({ value: attrValue, matcher: attribute.matcher });
        }

        // Generate Attributes regexp
        for (const name in attributes) {
          attrResults.push(attributeToRegexp(name, attributes[name]));
        }
        elementResult = attrResults.join('|') + `{${attrResults.length}}`;

        // If tagName exist
        if (node.tagName) {
          type = node.tagName;
        }

        selectorResult.push(elementTemplate({ type: type, attributes: elementResult }));
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
        } else {
          return;
        }
      }
    }

    result.push(selectorResult.join(''));
  }

  return result.join('|');
};

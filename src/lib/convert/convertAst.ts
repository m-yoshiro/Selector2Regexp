import type { CssNode } from 'css-tree';
import { walk } from 'css-tree';
import { Element } from '../node/element';
import { Combinator } from '../node/combinator';
import { Selector } from '../node/selector';
import type { Attribute } from '../../../types';
import { escapeRegExp } from '../utils';

export const convertToAst = (ast: CssNode) => {
  let current: Element;
  const result = new Selector();

  walk(ast, (node, item) => {
    // Skip
    if (node.type === 'SelectorList' || node.type === 'Selector') {
      return;
    }

    // Element
    const isForElement = node.type === 'ClassSelector' || node.type === 'IdSelector' || node.type === 'TypeSelector' || node.type === 'AttributeSelector';
    const isForAttribute = node.type === 'ClassSelector' || node.type === 'IdSelector' || node.type === 'AttributeSelector';

    if (isForElement) {
      if (!(current instanceof Element)) {
        current = new Element();
      }

      // Convert attributes
      if (isForAttribute) {
        const attr: Attribute = { name: '', value: '' };

        if (node.type === 'ClassSelector') {
          current.classList?.push(node.name);
        } else if (node.type === 'IdSelector') {
          current.id = node.name;
        } else if (node.type === 'AttributeSelector') {
          attr.name = typeof node.name === 'string' ? node.name : node.name.name;
          attr.value = (() => {
            // eslint-disable-next-line prettier/prettier
            let value = 
              node.value?.type === 'Identifier' ? node.value.name :
              node.value?.type === 'String' ? node.value.value : null;

            value = value && escapeRegExp(value);

            return value;
          })();
          attr.matcher = node.matcher;
        }

        current.addAttr(attr);
      } else if (node.type === 'TypeSelector') {
        current.tagName = node.name;
      }

      // End of element convert.
      if (!item.next) {
        result.add(current);
      }
    }

    // Combinator
    if (node.type === 'Combinator' || node.type === 'WhiteSpace') {
      if (current._tagName || current.attributes.length > 0) {
        result.add(current);
        const name = node.type === 'Combinator' ? node.name : node.type;
        const combinator = new Combinator(name);

        result.add(combinator);
      }
    }
  });

  return result;
};

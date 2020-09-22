import { CssNode, walk } from 'css-tree';
import { Element } from '../node/element';
import { Combinator } from '../node/combinator';
import { Selector } from '../node/selector';
import { Attribute } from '../../../types';

export const convertToAst = (ast: CssNode) => {
  let current: Element;
  const result = new Selector();
  const INNER_ATTR_NAME = {
    ClassSelector: 'class',
    IdSelector: 'id',
  };

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

        if (node.type === 'ClassSelector' || node.type === 'IdSelector') {
          attr.name = INNER_ATTR_NAME[node.type];
          attr.value = node.name;
        } else if (node.type === 'AttributeSelector') {
          attr.name = typeof node.name === 'string' ? node.name : node.name.name;
          attr.value = (() => {
            if (node.value?.type === 'Identifier') {
              return node.value.name;
            } else if (node.value?.type === 'String') {
              return node.value.value;
            }
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
        const combinator = new Combinator();
        combinator.add(node);

        result.add(combinator);
      }
    }
  });

  return result;
};

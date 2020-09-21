import { CssNode, walk } from 'css-tree';
import { Element } from '../node/element';
import { Combinator } from '../node/combinator';
import { Selector } from '../node/selector';

export const convertToAst = (ast: CssNode) => {
  let current: Element;
  const result = new Selector();

  walk(ast, (node, item) => {
    if (node.type === 'SelectorList' || node.type === 'Selector') {
      return;
    }

    // Element
    if (node.type === 'ClassSelector' || node.type === 'IdSelector' || node.type === 'TypeSelector' || node.type === 'AttributeSelector') {
      if (!(current instanceof Element)) {
        current = new Element();
      }
      current.add(node);

      if (!item.next) {
        result.add(current);
      }
    }

    // Combinator
    if (node.type === 'Combinator' || node.type === 'WhiteSpace') {
      if (current.tagName || current.attributes.length > 0) {
        result.add(current);
        const combinator = new Combinator();
        combinator.add(node);

        result.add(combinator);
      }
    }
  });

  return result;
};

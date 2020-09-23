import { CssNode, walk } from 'css-tree';
import { convertToAst } from './convertAst';

const splitSelectorList = (ast: CssNode) => {
  if (ast.type !== 'SelectorList') {
    return [ast];
  }

  const result: CssNode[] = [];
  walk(ast, {
    visit: 'Selector',
    enter: (node) => {
      result.push(node);
      return;
    },
  });

  return result;
};

export const convert = (ast: CssNode) => {
  if (ast.type === 'SelectorList') {
    const selectorList = splitSelectorList(ast);
    return selectorList?.map((selector) => convertToAst(selector));
  }

  return convertToAst(ast);
};

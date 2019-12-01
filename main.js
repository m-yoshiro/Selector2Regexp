const csstree = require('css-tree');

const ast = csstree.parse('.exapmle', {
  context: 'selector'
});

// csstree.walk(ast, node => {
//   console.log(node.type)
// })

csstree.walk(ast, {
  visit: 'ClassSelector',
  enter: node => {
    console.log(node.name);
  }
})
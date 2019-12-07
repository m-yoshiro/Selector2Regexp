module.exports = function (nodes) {
  const translation = {
    'ClassSelector': 'class',
    'IdSelector': 'id',
  }

  if (!Object.keys(translation).includes(nodes[0].type)) {
    throw Error();
  }

  const selector = nodes[0].name;
  const attribute = translation[nodes[0].type];

  return `${attribute}=['\"]s?(${selector})s?['\"]`;
}
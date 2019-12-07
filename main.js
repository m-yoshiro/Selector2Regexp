const csstree = require("css-tree");
const getSelectorNodes = require("./lib/getSelectorNodes");
const generateRegexString = require("./lib/generateRegexString");

module.exports = function cssSearchAdviser(data) {
  if (!data) {
    throw Error();
  }
  const nodes = getSelectorNodes(data);
  const result = generateRegexString(nodes);

  console.log(result)
  return result;
};
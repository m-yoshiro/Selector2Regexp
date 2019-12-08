const csstree = require("css-tree");
const getSelectorNodes = require("./lib/getSelectorNodes");
const generateRegexString = require("./lib/generateRegexString");

module.exports = function cssSearchAdviser(data) {
  if (!data) {
    throw new Error('1 argument required, but only 0 present.');
  }
  const nodes = getSelectorNodes(data);
  const result = nodes.map(node => generateRegexString(node));

  return result;
};
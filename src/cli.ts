import selector2Regexp from './index';
import yargs from 'yargs';

export default () => {
  const argv = yargs
    .usage(
      `
Usage:
  $0 [CSS Selector]
`
    )
    .example('$0 ".example"', 'Basic usage')
    .demandCommand(1)
    .help('h')
    .alias('h', 'help')
    .version(require('../package.json').version)
    .alias('v', 'version').argv;

  const input = argv._;

  console.log(argv);

  if (input.length > 1) {
    throw new Error('Multiple input is not supported.');
  }

  console.log(selector2Regexp(input[0]));
};

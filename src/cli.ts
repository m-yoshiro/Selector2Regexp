import selector2Regexp from './index';
import yargs from 'yargs';

export default (args: string[]) => {
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version(require('../package.json').version)
    .alias('v', 'version')
    .parse(args);

  const input = argv._;

  if (input.length > 1) {
    throw new Error('Multiple input is not supported.');
  }

  process.stdout.write(selector2Regexp(input[0]) + '\n');
};

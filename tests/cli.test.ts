import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const cliMock = async (args: string[]) => {
  const asyncExec = promisify(exec);
  const { stdout, stderr } = await asyncExec(`${path.resolve('bin/selector2regexp')} ${args.join(' ')}`);

  if (stderr) {
    return stderr;
  }

  return stdout;
};

describe('CLI', () => {
  it('.button', async () => {
    await expect(cliMock(['.button'])).resolves.toBe('<\\s*(\\w+)\\s+.*(class=[\'"]\\w*\\s*(?<!\\w)(button)(?!\\w)\\s*\\w*[\'"]).*\\s*>' + '\n');
  });
});

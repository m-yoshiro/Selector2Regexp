import { spawn } from 'child_process';
const s2r = spawn('s2r', ['.button']);

s2r.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

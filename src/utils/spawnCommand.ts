import { spawn } from 'node:child_process';

export interface SpawnCommandOptions {
  logData?: boolean;
}

export const spawnCommand = (
  command: string,
  { logData = false }: SpawnCommandOptions = {},
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      shell: true,
    });

    if (logData) {
      child.stderr.on('data', (data) => {
        console.log(data.toString());
      });
    }

    child.on('error', reject);

    child.on('close', resolve);
  });
};

import fs from 'node:fs';

export const createTextFile = (
  filePath: string,
  content: string,
): Promise<void> => {
  return fs.promises.writeFile(filePath, content, { encoding: 'utf-8' });
};

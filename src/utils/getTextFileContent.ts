import fs from 'node:fs';

export const getTextFileContent = async (filePath: string): Promise<string> => {
  return fs.promises.readFile(filePath, {
    encoding: 'utf-8',
  });
};

import fs from 'node:fs';

export const isFileExists = async (file: string): Promise<boolean> => {
  try {
    const stat = await fs.promises.stat(file);

    return stat.isFile();
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      throw error;
    }
  }
};

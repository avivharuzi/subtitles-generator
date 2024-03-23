import fs from 'node:fs';

import { isDirExists } from './isDirExists.js';

export const deleteDir = async (path: string): Promise<void> => {
  if (!path || !(await isDirExists(path))) {
    return;
  }

  return fs.promises.rm(path, {
    force: true,
    maxRetries: 5,
    recursive: true,
    retryDelay: 4000,
  });
};

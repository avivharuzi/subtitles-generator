import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { generateUUID } from './generateUUID.js';

export const createTempDir = (prefix: string): Promise<string> =>
  fs.promises.mkdtemp(
    path.join(os.tmpdir(), `${prefix}-temp-${generateUUID()}-`),
  );

import crypto from 'node:crypto';

export const generateUUID = (): string =>
  crypto.randomBytes(16).toString('hex');

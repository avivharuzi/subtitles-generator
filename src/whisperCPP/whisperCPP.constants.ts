import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

export const WHISPER_CPP_DIR = join(
  CURRENT_DIR,
  '..',
  '..',
  'bindings',
  'whisper.cpp',
);

export const WHISPER_CPP_MODELS_DIR = join(WHISPER_CPP_DIR, 'models');

export const WHISPER_CPP_DOWNLOAD_MODEL_SCRIPT_FILE_PATH = join(
  WHISPER_CPP_MODELS_DIR,
  process.platform === 'win32'
    ? 'download-ggml-model.cmd'
    : 'download-ggml-model.sh',
);

export const WHISPER_CPP_EXEC_FILE_PATH = join(WHISPER_CPP_DIR, 'main');

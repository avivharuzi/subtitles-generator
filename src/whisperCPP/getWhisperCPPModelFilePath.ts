import { join } from 'node:path';

import { WHISPER_CPP_MODELS_DIR } from './whisperCPP.constants.js';
import { WhisperCPPModelType } from './whisperCPPModelType.js';

export const getWhisperCPPModelFilePath = (modelType: WhisperCPPModelType) =>
  join(WHISPER_CPP_MODELS_DIR, `ggml-${modelType}.bin`);

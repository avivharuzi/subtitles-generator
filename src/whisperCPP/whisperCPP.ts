import { isFileExists } from '../utils/isFileExists.js';
import { spawnCommand } from '../utils/spawnCommand.js';
import { getWhisperCPPExecuteFlags } from './getWhisperCPPExecuteFlags.js';
import { getWhisperCPPModelFilePath } from './getWhisperCPPModelFilePath.js';
import {
  WHISPER_CPP_DIR,
  WHISPER_CPP_DOWNLOAD_MODEL_SCRIPT_FILE_PATH,
  WHISPER_CPP_EXEC_FILE_PATH,
} from './whisperCPP.constants.js';
import {
  WHISPER_CPP_MODEL_TYPES,
  WhisperCPPModelType,
} from './whisperCPPModelType.js';

const validateModelType = (modelType: WhisperCPPModelType): void => {
  if (!WHISPER_CPP_MODEL_TYPES.includes(modelType)) {
    throw new Error(
      `modelType must be one of those values: ${WHISPER_CPP_MODEL_TYPES.join(', ')}`,
    );
  }
};

const isModelDownloaded = async (
  modelType: WhisperCPPModelType,
): Promise<boolean> => {
  const modelFilePath = getWhisperCPPModelFilePath(modelType);

  return await isFileExists(modelFilePath);
};

const createExecFile = async () =>
  await spawnCommand(`cd ${WHISPER_CPP_DIR} && make`);

const downloadModel = async (modelType: WhisperCPPModelType): Promise<void> => {
  await spawnCommand('echo "hello"');

  if (await isModelDownloaded(modelType)) {
    console.info(`whisper.cpp model "${modelType}" was already downloaded`);

    return;
  }

  validateModelType(modelType);

  const scriptFilePath = WHISPER_CPP_DOWNLOAD_MODEL_SCRIPT_FILE_PATH;

  if (!(await isFileExists(scriptFilePath))) {
    throw new Error(
      `whisper.cpp download model "${modelType}" script was not found, file path: ${scriptFilePath}`,
    );
  }

  console.info(`whisper.cpp downloading model "${modelType}"...`);

  await spawnCommand(`${scriptFilePath} ${modelType}`);

  console.info(`whisper.cpp model "${modelType}" was downloaded successfully`);

  await createExecFile();
};

export type WhisperCPPExecutionOutputFormat =
  | 'txt'
  | 'vtt'
  | 'srt'
  | 'lrc'
  | 'csv'
  | 'json';

export interface WhisperCPPExecuteOptions {
  outputFilePath: string;
  outputFormat: WhisperCPPExecutionOutputFormat;
  modelType?: WhisperCPPModelType;
  shouldTryToDownloadModel?: boolean;
  language?: 'auto' | string;
  translateToEnglish?: boolean;
}

const execute = async (
  inputFilePath: string,
  {
    outputFilePath,
    outputFormat,
    modelType = WhisperCPPModelType.BaseEn,
    shouldTryToDownloadModel = true,
    language = 'en',
    translateToEnglish = false,
  }: WhisperCPPExecuteOptions,
): Promise<void> => {
  if (shouldTryToDownloadModel) {
    await downloadModel(modelType);
  }

  if (!(await isModelDownloaded(modelType))) {
    throw new Error(
      `whisper.cpp model "${modelType}" should be downloaded before, download the model or use "shouldTryToDownloadModel"`,
    );
  }

  const execFilePath = WHISPER_CPP_EXEC_FILE_PATH;

  if (!(await isFileExists(execFilePath))) {
    await createExecFile();
  }

  if (!(await isFileExists(execFilePath))) {
    throw new Error(`failed to create whisper.cpp main file`);
  }

  const modelFilePath = getWhisperCPPModelFilePath(modelType);

  const flags = getWhisperCPPExecuteFlags({
    translate: translateToEnglish,
    outputTXT: outputFormat === 'txt' ? true : undefined,
    outputVTT: outputFormat === 'vtt' ? true : undefined,
    outputSRT: outputFormat === 'srt' ? true : undefined,
    outputLRC: outputFormat === 'lrc' ? true : undefined,
    outputCSV: outputFormat === 'csv' ? true : undefined,
    outputJSON: outputFormat === 'json' ? true : undefined,
    outputFile: outputFilePath,
    language,
    model: modelFilePath,
    file: inputFilePath,
  });

  const command = `${execFilePath} ${flags}`;

  console.info(`executing whisper.cpp command: ${command}`);

  await spawnCommand(command);
};

export const whisperCPP = {
  isModelDownloaded: isModelDownloaded,
  downloadModel: downloadModel,
  execute: execute,
};

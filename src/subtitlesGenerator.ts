import path from 'node:path';

import { ffmpegConvertToWAV } from './ffmpeg/ffmpegConvertToWAV.js';
import { createTempDir } from './utils/createTempDir.js';
import { createTextFile } from './utils/createTextFile.js';
import { deleteDir } from './utils/deleteDir.js';
import { generateUUID } from './utils/generateUUID.js';
import { getTextFileContent } from './utils/getTextFileContent.js';
import {
  whisperCPP,
  WhisperCPPExecuteLanguage,
  WhisperCPPExecuteOutputFormat,
} from './whisperCPP/whisperCPP.js';
import { whisperCPPJSONToSRTContent } from './whisperCPP/whisperCPPJSONToSRT.js';
import {
  WHISPER_CPP_MODEL_TYPES,
  WhisperCPPModelType,
} from './whisperCPP/whisperCPPModelType.js';

export type SubtitleGeneratorModelType = WhisperCPPModelType;

export const SUBTITLE_GENERATOR_MODEL_TYPES = WHISPER_CPP_MODEL_TYPES;

export type SubtitleGeneratorLanguage = WhisperCPPExecuteLanguage;

export type SubtitlesGeneratorOptions = {
  outputFilePath?: string;
  modelType?: SubtitleGeneratorModelType;
  shouldTryToDownloadModel?: boolean;
  language?: SubtitleGeneratorLanguage;
  translateToEnglish?: boolean;
};

const VALID_INPUT_FILE_WAV_EXTENSION = '.wav';

export const subtitlesGenerator = async (
  inputFilePath: string,
  options: SubtitlesGeneratorOptions = {},
): Promise<string> => {
  const tempDir = await createTempDir('subtitles-generator');

  try {
    let whisperCPPInputFilePath: string;

    if (!inputFilePath.endsWith(VALID_INPUT_FILE_WAV_EXTENSION)) {
      // This not wav file let's try to convert the file into wav file.

      console.info(`trying to create wav file from file: ${inputFilePath}`);

      const outputFilePathWav = path.join(
        tempDir,
        `${generateUUID()}${VALID_INPUT_FILE_WAV_EXTENSION}`,
      );

      await ffmpegConvertToWAV(inputFilePath, outputFilePathWav);

      console.info(`created wav file from file: ${inputFilePath}`);

      whisperCPPInputFilePath = outputFilePathWav;
    } else {
      whisperCPPInputFilePath = inputFilePath;
    }

    const whisperCPPOutputFilePath = path.join(tempDir, generateUUID());
    const outputFormat: WhisperCPPExecuteOutputFormat = 'json';

    console.info('executing whisper.cpp');

    await whisperCPP.execute(whisperCPPInputFilePath, {
      outputFilePath: whisperCPPOutputFilePath,
      outputFormat,
      modelType: options.modelType,
      shouldTryToDownloadModel: options.shouldTryToDownloadModel,
      language: options.language,
      translateToEnglish: options.translateToEnglish,
    });

    const whisperCPPOutputFilePathWithExtension = `${whisperCPPOutputFilePath}.${outputFormat}`;

    const jsonContent = await getTextFileContent(
      whisperCPPOutputFilePathWithExtension,
    );

    const srtContent = whisperCPPJSONToSRTContent(jsonContent);

    const parsedInputFilePath = path.parse(inputFilePath);
    const outputFilePathAlternative = path.join(
      parsedInputFilePath.dir,
      parsedInputFilePath.name,
    );

    const srtOutputFilePath = `${options.outputFilePath || outputFilePathAlternative}.srt`;

    await createTextFile(srtOutputFilePath, srtContent);

    return srtOutputFilePath;
  } catch (error) {
    console.error(`Failed to generate subtitles, error: ${error?.toString()}`);

    throw error;
  } finally {
    try {
      await deleteDir(tempDir);
    } catch (error) {
      console.error(`Failed to delete temporary directory, path: ${tempDir}`);
    }
  }
};

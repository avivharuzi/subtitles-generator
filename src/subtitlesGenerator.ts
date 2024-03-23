import path from 'node:path';

import { ffmpegConvertToWAV } from './ffmpeg/ffmpegConvertToWAV.js';
import { createTempDir } from './utils/createTempDir.js';
import { createTextFile } from './utils/createTextFile.js';
import { deleteDir } from './utils/deleteDir.js';
import { generateUUID } from './utils/generateUUID.js';
import { getTextFileContent } from './utils/getTextFileContent.js';
import {
  whisperCPP,
  WhisperCPPExecuteOptions,
  WhisperCPPExecutionOutputFormat,
} from './whisperCPP/whisperCPP.js';
import { whisperCPPJSONToSRTContent } from './whisperCPP/whisperCPPJSONToSRT.js';

export type SubtitlesGeneratorOptions = {
  outputFilePath?: string;
} & Pick<
  WhisperCPPExecuteOptions,
  'modelType' | 'shouldTryToDownloadModel' | 'language' | 'translateToEnglish'
>;

const VALID_INPUT_FILE_WAV_EXTENSION = '.wav';

export const subtitlesGenerator = async (
  inputFilePath: string,
  options: SubtitlesGeneratorOptions = {},
) => {
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
    const outputFormat: WhisperCPPExecutionOutputFormat = 'json';

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

    await createTextFile(
      `${options.outputFilePath || outputFilePathAlternative}.srt`,
      srtContent,
    );
  } catch (error) {
    console.error(`Failed to generate subtitles, error: ${error?.toString()}`);
  } finally {
    try {
      await deleteDir(tempDir);
    } catch (error) {
      console.error(`Failed to delete temporary directory, path: ${tempDir}`);
    }
  }
};
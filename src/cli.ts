#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import {
  SUBTITLE_GENERATOR_MODEL_TYPES,
  subtitlesGenerator,
} from './subtitlesGenerator.js';

const argv = await yargs(hideBin(process.argv))
  .options('input', {
    alias: 'i',
    type: 'string',
    demandOption: true,
    describe: 'Video or Audio file path',
  })
  .options('outputFilePath', {
    alias: 'o',
    type: 'string',
    describe:
      'The file path where the subtitles result will go to (do not use file extension)',
  })
  .options('modelType', {
    alias: 'm',
    type: 'string',
    demandOption: true,
    choices: SUBTITLE_GENERATOR_MODEL_TYPES,
    describe: 'The whisper.cpp model type',
  })
  .options('shouldTryToDownloadModel', {
    alias: 'dm',
    type: 'boolean',
    default: true,
    describe: 'If to try to download the selected model',
  })
  .options('language', {
    alias: 'l',
    type: 'string',
    default: 'en',
    describe: `The spoken language ('auto' for auto-detect)`,
  })
  .options('translateToEnglish', {
    alias: 'tte',
    type: 'boolean',
    default: false,
    describe: 'If to translate from source language to english',
  }).argv;

const {
  input,
  outputFilePath,
  modelType,
  shouldTryToDownloadModel,
  language,
  translateToEnglish,
} = argv;

await subtitlesGenerator(input, {
  outputFilePath,
  modelType,
  shouldTryToDownloadModel,
  language,
  translateToEnglish,
});

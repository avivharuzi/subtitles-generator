export interface WhisperCPPExecuteFlagsOptions {
  threads?: number; // 4 - number of threads to use during computation
  processors?: number; // 1 - number of processors to use during computation
  offsetT?: number; // 0 - time offset in milliseconds
  offsetN?: number; // 0 - segment index offset
  duration?: number; // 0 - duration of audio to process in milliseconds
  maxContext?: number; // -1 - maximum number of text context tokens to store
  maxLen?: number; // 0 - maximum segment length in characters
  splitOnWord?: boolean; // false - split on word rather than on token
  bestOf?: number; // 2 - number of the best candidates to keep
  beamSize?: number; // -1 - beam size for beam search
  wordThold?: number; // 0.01 - word timestamp probability threshold
  entropyThold?: number; // 2.40 - entropy threshold for decoder fail
  logprobThold?: number; // -1.00 - log probability threshold for decoder fail
  debugMode?: boolean; // false - enable debug mode (eg. dump log_mel)
  translate?: boolean; // false - translate from source language to english
  diarize?: boolean; // false - stereo audio diarization
  tinydiarize?: boolean; // false - enable tinydiarize (requires a tdrz model)
  noFallback?: boolean; // false - do not use temperature fallback while decoding
  outputTXT?: boolean; // false - output result in a text file
  outputVTT?: boolean; // false - output result in a vtt file
  outputSRT?: boolean; // false - output result in a srt file
  outputLRC?: boolean; // false - output result in a lrc file
  outputWords?: boolean; // false - output script for generating karaoke video
  fontPath?: string; // /System/Library/Fonts/Supplemental/Courier New Bold.ttf - path to a monospace font for karaoke video
  outputCSV?: boolean; // false - output result in a CSV file
  outputJSON?: boolean; // false - output result in a JSON file
  outputFile: string; // output file path (without file extension)
  printSpecial?: boolean; // false - print special tokens
  printColors?: boolean; // false - print colors
  printProgress?: boolean; // false - print progress
  noTimestamps?: boolean; // false - do not print timestamps
  language?: string; // en - spoken language ('auto' for auto-detect)
  detectLanguage?: boolean; // false - exit after automatically detecting language
  prompt?: string; // initial prompt
  model?: string; // models/ggml-base.en.bin - model path
  file: string; // input WAV file path
  ovEDevice?: string; // CPU - the OpenVINO device used for encode inference
  logScore?: boolean; // false - log best decoder scores of token
}

type WhisperCPPExecuteFlagsOptionsKeys = keyof WhisperCPPExecuteFlagsOptions;

const WHISPER_CPP_EXECUTE_FLAGS_OPTIONS_MAP: Record<
  WhisperCPPExecuteFlagsOptionsKeys,
  `-${string}`
> = {
  threads: '-t',
  processors: '-p',
  offsetT: '-ot',
  offsetN: '-on',
  duration: '-d',
  maxContext: '-mc',
  maxLen: '-ml',
  splitOnWord: '-sow',
  bestOf: '-bo',
  beamSize: '-bs',
  wordThold: '-wt',
  entropyThold: '-et',
  logprobThold: '-lpt',
  debugMode: '-debug',
  translate: '-tr',
  diarize: '-di',
  tinydiarize: '-tdrz',
  noFallback: '-nf',
  outputTXT: '-otxt',
  outputVTT: '-ovtt',
  outputSRT: '-osrt',
  outputLRC: '-olrc',
  outputWords: '-owts',
  fontPath: '-fp',
  outputCSV: '-ocsv',
  outputJSON: '-oj',
  outputFile: '-of',
  printSpecial: '-ps',
  printColors: '-pc',
  printProgress: '-pp',
  noTimestamps: '-nt',
  language: '-l',
  detectLanguage: '-dl',
  prompt: '--prompt',
  model: '-m',
  file: '-f',
  ovEDevice: '-oved',
  logScore: '-ls',
};

export const getWhisperCPPExecuteFlags = (
  options: WhisperCPPExecuteFlagsOptions,
): string => {
  return Object.entries(options).reduce((currentFlags, [key, flagValue]) => {
    if (flagValue === undefined || flagValue === null) {
      return currentFlags;
    }

    const flagOption =
      WHISPER_CPP_EXECUTE_FLAGS_OPTIONS_MAP[
        key as WhisperCPPExecuteFlagsOptionsKeys
      ];

    currentFlags += `${currentFlags.length ? ' ' : ''}${flagOption} ${flagValue}`;

    return currentFlags;
  }, '');
};

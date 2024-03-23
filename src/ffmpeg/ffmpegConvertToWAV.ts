import ffmpeg from 'fluent-ffmpeg';


/**
 * ffmpeg -i input.mp3 -ar 16000 -ac 1 -c:a pcm_s16le output.wav
 */
export const ffmpegConvertToWAV = (
  inputFilePath: string,
  outputFilePath: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .outputOption(['-ar', '16000'])
      .audioChannels(1)
      .audioCodec('pcm_s16le')
      .on('end', resolve)
      .on('error', reject)
      .save(outputFilePath);
  });
};

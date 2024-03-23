interface WhisperCPPJSON {
  transcription: WhisperCPPJSONTranscription[];
}

interface WhisperCPPJSONTranscription {
  timestamps: WhisperCPPJSONTimestamps;
  offsets: WhisperCPPJSONOffsets;
  text: string; // ' She has also lost someone.'
}

interface WhisperCPPJSONTimestamps {
  from: string; // '00:00:00,000'
  to: string; // '00:00:02,340'
}

interface WhisperCPPJSONOffsets {
  from: number; // 0
  to: number; // 2340
}

export const whisperCPPJSONToSRTContent = (jsonContent: string): string => {
  const json = JSON.parse(jsonContent) as WhisperCPPJSON;

  const transcriptions = json.transcription;

  let srtContent = '';

  transcriptions.forEach((transcription, index) => {
    srtContent += `${index + 1}\n`;
    srtContent += `${transcription.timestamps.from} --> ${transcription.timestamps.to}\n`;
    srtContent += `${transcription.text.trim()}\n`;
    srtContent += '\n';
  });

  return srtContent;
};

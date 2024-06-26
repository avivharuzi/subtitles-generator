export enum WhisperCPPModelType {
  TinyEn = 'tiny.en',
  Tiny = 'tiny',
  BaseEn = 'base.en',
  Base = 'base',
  SmallEn = 'small.en',
  Small = 'small',
  MediumEn = 'medium.en',
  Medium = 'medium',
  LargeV1 = 'large-v1',
  LargeV2 = 'large-v2',
  LargeV3 = 'large-v3',
}

export const WHISPER_CPP_MODEL_TYPES = Object.values(WhisperCPPModelType);

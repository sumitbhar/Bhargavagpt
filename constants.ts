import type { LlmModel } from './types';

export const APP_NAME = "BhargavaGPT";

export const MODELS: LlmModel[] = [
  // Google
  { id: 'gemini-2.5-flash', name: 'model_gemini_2_5_flash_name', provider: 'provider_google', isDownloadable: false },
  { id: 'gemini-2.5-flash-image-preview', name: 'model_nano_banana_name', provider: 'provider_google', isDownloadable: false },
];
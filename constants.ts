import type { LlmModel } from './types';

export const APP_NAME = "Bhargava GPT";

export const MODELS: LlmModel[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', isExternal: false },
];
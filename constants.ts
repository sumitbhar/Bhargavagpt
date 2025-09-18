import type { LlmModel } from './types';

export const APP_NAME = "BhargavaGPT";

export const MODELS: LlmModel[] = [
  // Google
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', isExternal: false, isDownloadable: false },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', isExternal: false, isDownloadable: false },
  { id: 'gemini-2.5-flash-image-preview', name: 'Nano Banana', provider: 'Google', isExternal: false, isDownloadable: false },
  
  // OpenAI
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', isExternal: true, isDownloadable: false },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', isExternal: true, isDownloadable: false },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', isExternal: true, isDownloadable: false },

  // Anthropic
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', isExternal: true, isDownloadable: true },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic', isExternal: true, isDownloadable: true },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', isExternal: true, isDownloadable: true },

  // Cohere
  { id: 'command-r-plus', name: 'Command R+', provider: 'Cohere', isExternal: true, isDownloadable: true },

  // Mistral AI
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral AI', isExternal: true, isDownloadable: true },
  { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'Mistral AI', isExternal: true, isDownloadable: true },

  // Meta
  { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta', isExternal: true, isDownloadable: true },
  { id: 'llama-3-8b', name: 'Llama 3 8B', provider: 'Meta', isExternal: true, isDownloadable: true },

  // DeepSeek
  { id: 'deepseek-v2', name: 'DeepSeek V2', provider: 'DeepSeek', isExternal: true, isDownloadable: true },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'DeepSeek', isExternal: true, isDownloadable: true },

  // Google (Open Models)
  { id: 'gemma-7b', name: 'Gemma 7B', provider: 'Google', isExternal: true, isDownloadable: true },

  // Other Open Source Models
  { id: 'dbrx-instruct', name: 'DBRX Instruct', provider: 'Databricks', isExternal: true, isDownloadable: true },
  { id: 'qwen2-72b', name: 'Qwen2 72B', provider: 'Alibaba', isExternal: true, isDownloadable: true },
  { id: 'yi-1.5-34b', name: 'Yi 1.5 34B', provider: '01.AI', isExternal: true, isDownloadable: true },
];
import type { LlmModel } from './types';

export const APP_NAME = "BhargavaGPT";

export const MODELS: LlmModel[] = [
  // Google
  { id: 'gemini-2.5-flash', name: 'model_gemini_2_5_flash_name', provider: 'provider_google', isExternal: false, isDownloadable: false },
  { id: 'gemini-2.5-pro', name: 'model_gemini_2_5_pro_name', provider: 'provider_google', isExternal: false, isDownloadable: false },
  { id: 'gemini-2.5-flash-image-preview', name: 'model_nano_banana_name', provider: 'provider_google', isExternal: false, isDownloadable: false },
  
  // OpenAI
  { id: 'gpt-4o', name: 'model_gpt_4o_name', provider: 'provider_openai', isExternal: true, isDownloadable: false },
  { id: 'gpt-4-turbo', name: 'model_gpt_4_turbo_name', provider: 'provider_openai', isExternal: true, isDownloadable: false },
  { id: 'gpt-3.5-turbo', name: 'model_gpt_3_5_turbo_name', provider: 'provider_openai', isExternal: true, isDownloadable: false },

  // Anthropic
  { id: 'claude-3-opus', name: 'model_claude_3_opus_name', provider: 'provider_anthropic', isExternal: true, isDownloadable: true },
  { id: 'claude-3-sonnet', name: 'model_claude_3_sonnet_name', provider: 'provider_anthropic', isExternal: true, isDownloadable: true },
  { id: 'claude-3-haiku', name: 'model_claude_3_haiku_name', provider: 'provider_anthropic', isExternal: true, isDownloadable: true },

  // Cohere
  { id: 'command-r-plus', name: 'model_command_r_plus_name', provider: 'provider_cohere', isExternal: true, isDownloadable: true },

  // Mistral AI
  { id: 'mistral-large', name: 'model_mistral_large_name', provider: 'provider_mistral_ai', isExternal: true, isDownloadable: true },
  { id: 'mixtral-8x7b', name: 'model_mixtral_8x7b_name', provider: 'provider_mistral_ai', isExternal: true, isDownloadable: true },

  // Meta
  { id: 'llama-3-70b', name: 'model_llama_3_70b_name', provider: 'provider_meta', isExternal: true, isDownloadable: true },
  { id: 'llama-3-8b', name: 'model_llama_3_8b_name', provider: 'provider_meta', isExternal: true, isDownloadable: true },

  // DeepSeek
  { id: 'deepseek-v2', name: 'model_deepseek_v2_name', provider: 'provider_deepseek', isExternal: true, isDownloadable: true },
  { id: 'deepseek-coder', name: 'model_deepseek_coder_name', provider: 'provider_deepseek', isExternal: true, isDownloadable: true },

  // Google (Open Models)
  { id: 'gemma-7b', name: 'model_gemma_7b_name', provider: 'provider_google', isExternal: true, isDownloadable: true },

  // Other Open Source Models
  { id: 'dbrx-instruct', name: 'model_dbrx_instruct_name', provider: 'provider_databricks', isExternal: true, isDownloadable: true },
  { id: 'qwen2-72b', name: 'model_qwen2_72b_name', provider: 'provider_alibaba', isExternal: true, isDownloadable: true },
  { id: 'yi-1.5-34b', name: 'model_yi_1_5_34b_name', provider: 'provider_01_ai', isExternal: true, isDownloadable: true },
];
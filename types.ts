
export type MessageSender = 'user' | 'ai';

export type CognitiveState = 'focused' | 'creative' | 'critical' | 'synthetic';

export interface Attachment {
  data: string; // Base64 encoded data
  mimeType: string;
  name: string;
}

export interface GroundingChunk {
  uri: string;
  title: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
  attachment?: Attachment;
  isAnalysis?: boolean;
  analysisForId?: string;
  cognitiveState?: CognitiveState; // State used to generate this message
  groundingChunks?: GroundingChunk[];
}

export interface AiResponse {
  text: string;
  attachment?: Attachment;
  groundingChunks?: GroundingChunk[];
}


export interface Chat {
  id:string;
  title: string;
  messages: ChatMessage[];
  personaId?: string;
  customInstruction?: string;
  modelId: string;
  cognitiveState: CognitiveState;
}

export interface LlmModel {
  id: string;
  name: string;
  provider: string;
  isExternal: boolean;
  isDownloadable: boolean;
}

// Type definitions for the Web Speech API
export interface SpeechRecognitionResult {
  [index: number]: { transcript: string };
  length: number;
  isFinal: boolean;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionErrorEvent {
  error: string;
}

export interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: () => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}
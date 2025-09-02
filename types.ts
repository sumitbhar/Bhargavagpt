
export type MessageSender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  text: string;
  sender: MessageSender;
}

export interface Chat {
  id:string;
  title: string;
  messages: ChatMessage[];
  personaId?: string;
  customInstruction?: string;
}

export interface LlmModel {
  id: string;
  name: string;
  provider: string;
  isExternal: boolean;
}

// Type definitions for the Web Speech API
// FIX: Export Speech Recognition types and add missing resultIndex property.
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
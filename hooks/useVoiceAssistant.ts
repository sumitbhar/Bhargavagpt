

import { useState, useRef, useEffect, useCallback } from 'react';
// FIX: Import SpeechRecognition type to resolve type error.
import type { SpeechRecognition } from '../types';

interface VoiceAssistantOptions {
  onTranscriptReady: (transcript: string) => void;
  onError: (error: string) => void;
  speak: (text: string, onEnd?: () => void) => void;
  language: string;
}

export const useVoiceAssistant = ({ onTranscriptReady, onError, speak, language }: VoiceAssistantOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        onError("Microphone permission was denied. Please allow microphone access in your browser's site settings to use the voice assistant.");
      } else {
        onError(`A speech recognition error occurred: ${event.error}`);
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript.trim()) {
        onTranscriptReady(finalTranscript.trim());
        // Stop listening after a final transcript is processed to allow the AI to respond.
        if(recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } else {
        // Update transcript for interim results if needed for UI feedback
        let interimTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            interimTranscript += event.results[i][0].transcript;
        }
        setTranscript(interimTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [onTranscriptReady, onError, language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      // Cancel any ongoing speech before listening
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      try {
        recognitionRef.current.start();
      } catch(e) {
        console.error("Error starting speech recognition:", e);
        onError("Could not start listening. Please try again.");
      }
    }
  }, [isListening, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speakWithState = useCallback((text: string, onEnd?: () => void) => {
     stopListening();
     setIsSpeaking(true);
     speak(text, () => {
        setIsSpeaking(false);
        if (onEnd) {
          onEnd();
        }
     });
  }, [speak, stopListening]);


  return { isListening, isSpeaking, transcript, startListening, stopListening, speak: speakWithState };
};

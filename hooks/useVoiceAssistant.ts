

import { useState, useRef, useEffect, useCallback } from 'react';
import type { SpeechRecognition } from '../types';

interface VoiceAssistantOptions {
  onTranscriptReady: (transcript: string) => void;
  onError: (error: string) => void;
  language: string;
}

export const useVoiceAssistant = ({ onTranscriptReady, onError, language }: VoiceAssistantOptions) => {
  const [isListening, setIsListening] = useState(false);
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
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcriptPart;
            } else {
                interimTranscript += transcriptPart;
            }
        }

        // Update the live transcript for display. It reflects what is currently being said.
        setTranscript(interimTranscript);
        
        // If a phrase has been finalized, send it. The listening will continue.
        if (finalTranscript.trim()) {
            onTranscriptReady(finalTranscript.trim());
            // Clear the interim transcript as the final version was just sent.
            setTranscript('');
        }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscriptReady, onError, language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
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


  return { isListening, transcript, startListening, stopListening };
};
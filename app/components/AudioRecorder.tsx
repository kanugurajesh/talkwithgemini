'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { FaMicrophone, FaStop, FaVolumeUp, FaVolumeMute, FaRegSmile } from 'react-icons/fa';
import { ImSpinner8 } from 'react-icons/im';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const welcomeMessages = useMemo(() => [
    "Hi there! I&apos;m Gemini, your AI friend. What&apos;s on your mind?",
    "Hello! I&apos;m excited to chat with you. What would you like to talk about?",
    "Hey! I&apos;m here to help and chat. What shall we discuss today?",
    "Welcome! I&apos;m your friendly AI companion. How can I make your day better?",
  ], []); // Empty dependency array since these messages never change

  useEffect(() => {
    speechSynthesisRef.current = new SpeechSynthesisUtterance();
    speechSynthesisRef.current.rate = 1;
    speechSynthesisRef.current.pitch = 1;
    
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        voice => voice.name.includes('Female') || voice.name.includes('Natural')
      ) || voices[0];
      
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.voice = preferredVoice;
      }
    };

    window.speechSynthesis.onvoiceschanged = setVoice;
    setVoice();

    if (!conversationStarted) {
      const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      setResponse(randomMessage);
      setTimeout(() => {
        speakResponse(randomMessage);
      }, 500);
      setConversationStarted(true);
    }

    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [conversationStarted, isSpeaking, welcomeMessages]); 

  const startRecording = async () => {
    try {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setResponse('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mp3' });
        await processAudio(audioBlob);
        
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
      };
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await fetch('/api/audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioData: base64Audio,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setResponse(data.response);
          speakResponse(data.response);
        } else {
          setResponse('Error: ' + data.error);
        }
        setIsProcessing(false);
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      setResponse('Error processing audio');
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      
      speechSynthesisRef.current.text = text;
      speechSynthesisRef.current.onstart = () => setIsSpeaking(true);
      speechSynthesisRef.current.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(speechSynthesisRef.current);
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (response) {
      speakResponse(response);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {response && (
        <div className="w-full max-w-3xl animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg">
              <FaRegSmile className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-2xl p-4 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/50 shadow-xl">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Gemini</span>
                  <button
                    onClick={toggleSpeech}
                    className={`p-2 rounded-lg transition-all ${
                      isSpeaking 
                        ? 'bg-blue-500 text-white scale-110' 
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-300'
                    }`}
                    title={isSpeaking ? "Stop speaking" : "Speak response"}
                  >
                    {isSpeaking ? <FaVolumeUp className="w-4 h-4" /> : <FaVolumeMute className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{response}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl transition-opacity ${isRecording ? 'opacity-100' : 'opacity-0'}`}></div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`
            relative w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-300 ease-in-out
            ${isRecording 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 scale-110' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            shadow-lg hover:shadow-xl
          `}
          disabled={isProcessing}
        >
          {isRecording ? (
            <FaStop className="w-8 h-8 text-white animate-pulse" />
          ) : (
            <FaMicrophone className="w-8 h-8 text-white" />
          )}
        </button>
        {isRecording && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-500 dark:text-red-400 animate-pulse font-medium">
            I&apos;m listening...
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 animate-fadeIn">
          <ImSpinner8 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Thinking...</span>
        </div>
      )}
    </div>
  );
}

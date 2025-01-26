"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  FaMicrophone,
  FaStop,
  FaVolumeUp,
  FaVolumeMute,
  FaRegSmile,
  FaTrash,
  FaDownload,
  FaMoon,
  FaSun,
  FaHistory,
  FaFileExport,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "./ThemeProvider";

interface Message {
  id: string;
  content: string;
  type: "user" | "assistant";
  timestamp: Date;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const { theme, toggleTheme } = useTheme();

  const speakResponse = useCallback((text: string) => {
    if (speechSynthesisRef.current && !isMuted) {
      window.speechSynthesis.cancel();

      speechSynthesisRef.current.text = text;
      speechSynthesisRef.current.onstart = () => setIsSpeaking(true);
      speechSynthesisRef.current.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(speechSynthesisRef.current);
    }
  }, [isMuted]);

  const welcomeMessages = useMemo(
    () => [
      "Hi there! I&apos;m Gemini, your AI friend. What&apos;s on your mind?",
      "Hello! I&apos;m excited to chat with you. What would you like to talk about?",
      "Hey! I&apos;m here to help and chat. What shall we discuss today?",
      "Welcome! I&apos;m your friendly AI companion. How can I make your day better?",
    ],
    []
  );

  useEffect(() => {
    speechSynthesisRef.current = new SpeechSynthesisUtterance();
    speechSynthesisRef.current.rate = 1;
    speechSynthesisRef.current.pitch = 1;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (voice) =>
            voice.name.includes("Female") || voice.name.includes("Natural")
        ) || voices[0];

      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.voice = preferredVoice;
      }
    };

    window.speechSynthesis.onvoiceschanged = setVoice;
    setVoice();

    if (!conversationStarted) {
      const randomMessage =
        welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      const newMessage: Message = {
        id: Date.now().toString(),
        content: randomMessage,
        type: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
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
  }, [conversationStarted, isSpeaking, welcomeMessages, speakResponse]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");

        if (event.results[0].isFinal) {
          const newMessage: Message = {
            id: Date.now().toString(),
            content: transcript,
            type: "user",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, newMessage]);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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

      // Start both audio recording and speech recognition
      mediaRecorder.start();
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
      setIsRecording(true);
      setResponse("");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      // Try fallback to speech recognition only
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setIsRecording(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/mp3" });
        await processAudio(audioBlob);

        mediaRecorderRef.current?.stream
          .getTracks()
          .forEach((track) => track.stop());
      };
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const reader = new FileReader();

      reader.onload = async () => {
        const base64Audio = (reader.result as string).split(",")[1];

        const response = await fetch("/api/audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audioData: base64Audio,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          const newMessage: Message = {
            id: Date.now().toString(),
            content: data.response,
            type: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, newMessage]);
          setResponse(data.response);
          speakResponse(data.response);
        } else {
          const errorMessage: Message = {
            id: Date.now().toString(),
            content: "Error: " + data.error,
            type: "assistant",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setResponse("Error: " + data.error);
        }
        setIsProcessing(false);
      };

      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error("Error processing audio:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Error processing audio",
        type: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setResponse("Error processing audio");
      setIsProcessing(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const loadSessions = () => {
    const savedSessions = localStorage.getItem('chat-sessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: ChatSession) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setSessions(parsedSessions);
    }
  };

  const generateSessionTitle = (messages: Message[]): string => {
    if (messages.length === 0) return `New Chat ${new Date().toLocaleDateString()}`;
    
    // Try to find the first user message to use as title
    const firstUserMessage = messages.find(m => m.type === 'user');
    if (firstUserMessage) {
      // Take first 30 characters of the message or up to the first newline
      const title = firstUserMessage.content
        .split('\n')[0]
        .slice(0, 30)
        .trim();
      return title + (firstUserMessage.content.length > 30 ? '...' : '');
    }
    
    return `Chat ${new Date().toLocaleDateString()}`;
  };

  const saveSession = useCallback(() => {
    if (messages.length === 0) return;

    const session: ChatSession = {
      id: currentSessionId || Date.now().toString(),
      name: generateSessionTitle(messages),
      messages,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedSessions = currentSessionId
      ? sessions.map(s => s.id === currentSessionId ? session : s)
      : [...sessions, session];

    localStorage.setItem('chat-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
    setCurrentSessionId(session.id);
  }, [messages, currentSessionId, sessions]);

  useEffect(() => {
    if (messages.length > 0) {
      saveSession();
    }
  }, [messages, saveSession]);

  const loadSession = (sessionId: string) => {
    if (sessionId === "") {
      // Handle new chat
      setMessages([]);
      setCurrentSessionId("");
      setConversationStarted(false);
      return;
    }

    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
      setConversationStarted(true);
    }
  };

  const clearHistory = () => {
    setMessages([]);
    setResponse("");
    setConversationStarted(false);
    if (currentSessionId) {
      const updatedSessions = sessions.filter(s => s.id !== currentSessionId);
      localStorage.setItem('chat-sessions', JSON.stringify(updatedSessions));
      setSessions(updatedSessions);
      setCurrentSessionId("");
    }
  };

  const downloadHistory = (format: 'txt' | 'json') => {
    const currentSession = {
      id: currentSessionId || Date.now().toString(),
      name: `Chat ${new Date().toLocaleDateString()}`,
      messages,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    let content: string;
    let filename: string;
    let type: string;

    if (format === 'json') {
      content = JSON.stringify(currentSession, null, 2);
      filename = `${currentSession.name}.json`;
      type = 'application/json';
    } else {
      content = messages
        .map(msg => `${msg.type.toUpperCase()} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`)
        .join('\n\n');
      filename = `${currentSession.name}.txt`;
      type = 'text/plain';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteSession = (sessionId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering session selection
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('chat-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
    
    // If we're deleting the current session, clear it
    if (sessionId === currentSessionId) {
      setMessages([]);
      setCurrentSessionId("");
      setConversationStarted(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const sendTextMessage = async () => {
    if (!textInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: textInput,
      type: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      setIsProcessing(true);
      const response = await fetch("/api/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: data.response,
          type: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setResponse(data.response);
        speakResponse(data.response);
      } else {
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: "Error: " + data.error,
          type: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setResponse("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Error sending message",
        type: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setResponse("Error sending message");
    } finally {
      setIsProcessing(false);
      setTextInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 max-w-xs">
          <div className="relative">
            <button
              className="w-full bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm rounded-lg px-4 py-2.5 text-sm cursor-pointer border border-gray-200/20 dark:border-gray-700/50 hover:border-blue-500/50 focus:border-blue-500 transition-colors flex justify-between items-center"
              onClick={() => setIsSessionMenuOpen(!isSessionMenuOpen)}
            >
              <span>
                {currentSessionId 
                  ? sessions.find(s => s.id === currentSessionId)?.name || "Select Chat"
                  : "New Chat"}
              </span>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isSessionMenuOpen ? 'transform rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isSessionMenuOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200/20 dark:border-gray-700/50 py-1 max-h-60 overflow-y-auto">
                <div
                  className="px-4 py-2 hover:bg-blue-500/10 cursor-pointer flex items-center justify-between text-sm"
                  onClick={() => {
                    loadSession("");
                    setIsSessionMenuOpen(false);
                  }}
                >
                  <span className="font-medium">New Chat</span>
                </div>
                
                {sessions.length > 0 && <div className="border-t border-gray-200/10 my-1"></div>}
                
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className="px-4 py-2 hover:bg-blue-500/10 cursor-pointer"
                    onClick={() => {
                      loadSession(session.id);
                      setIsSessionMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-medium">{session.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(session.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteSession(session.id, e)}
                        className="ml-2 p-1 hover:bg-red-500/20 rounded-full text-red-400 hover:text-red-500 transition-colors"
                        title="Delete this chat"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl flex justify-end gap-2 mb-4">
        <button
          onClick={toggleMute}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-300 transition-all"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <FaVolumeMute className="w-4 h-4" />
          ) : (
            <FaVolumeUp className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-300 transition-all"
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <FaSun className="w-4 h-4" />
          ) : (
            <FaMoon className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={clearHistory}
          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/30 text-red-600 dark:text-red-400 transition-all"
          title="Clear conversation history"
        >
          <FaTrash className="w-4 h-4" />
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadHistory('txt')}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400 transition-all"
            title="Download as Text"
          >
            <FaFileExport className="w-4 h-4" />
          </button>
          <button
            onClick={() => downloadHistory('json')}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400 transition-all"
            title="Download as JSON"
          >
            <FaDownload className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.type === "assistant" ? "animate-fadeIn" : ""
            }`}
          >
            {message.type === "assistant" && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                <FaRegSmile className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`flex-1 ${
                message.type === "user" ? "ml-auto max-w-[80%]" : ""
              }`}
            >
              <div
                className={`rounded-2xl p-4 backdrop-blur-sm ${
                  message.type === "assistant"
                    ? "bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 border border-gray-200/20 dark:border-gray-700/50"
                    : "bg-gradient-to-r from-green-500/5 to-teal-500/5 dark:from-green-500/10 dark:to-teal-500/10 border border-gray-200/20 dark:border-gray-700/50"
                } shadow-xl`}
              >
                <div className="flex justify-between items-start gap-4 mb-2">
                  <span
                    className={`font-medium ${
                      message.type === "assistant"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {message.type === "assistant" ? "Gemini" : "You"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p
                          className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4 last:mb-0"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc pl-4 mb-4 last:mb-0"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal pl-4 mb-4 last:mb-0"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1 last:mb-0" {...props} />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic" {...props} />
                      ),
                      // @ts-ignore
                      code: ({ inline, className, children, ...props }) => {
                        return inline ? (
                          <code
                            className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl">
        <div className="relative">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message or press the microphone to speak..."
            className="w-full p-4 pr-24 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            rows={3}
            disabled={isProcessing || isRecording}
          />
          <div className="absolute right-2 bottom-2 flex gap-2">
            <button
              onClick={sendTextMessage}
              disabled={isProcessing || isRecording || !textInput.trim()}
              className={`p-2 rounded-lg transition-all ${
                isProcessing || isRecording || !textInput.trim()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div
          className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl transition-opacity ${
            isRecording ? "opacity-100" : "opacity-0"
          }`}
        ></div>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`
            relative w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-300 ease-in-out
            ${
              isRecording
                ? "bg-gradient-to-r from-red-500 to-pink-500 scale-110"
                : "bg-gradient-to-r from-blue-500 to-purple-500"
            }
            ${
              isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }
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

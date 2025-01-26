"use client";

import { FaMicrophone, FaHistory, FaFileExport, FaMagic, FaBrain } from "react-icons/fa";

const features = [
  {
    title: "Voice Interaction",
    description: "Talk naturally with Gemini AI using your voice, with real-time speech recognition and response.",
    icon: <FaMicrophone className="w-6 h-6" />,
  },
  {
    title: "Chat History Management",
    description: "Save, organize, and revisit your conversations with smart session management and easy exports.",
    icon: <FaHistory className="w-6 h-6" />,
  },
  {
    title: "Multiple Export Formats",
    description: "Export your conversations in both TXT and JSON formats for easy sharing and backup.",
    icon: <FaFileExport className="w-6 h-6" />,
  },
  {
    title: "Advanced AI Capabilities",
    description: "Powered by Google's Gemini AI for intelligent, context-aware conversations.",
    icon: <FaBrain className="w-6 h-6" />,
  },
  {
    title: "Smart Conversation Titles",
    description: "Automatically generated titles based on conversation context for easy reference.",
    icon: <FaMagic className="w-6 h-6" />,
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to chat with Gemini
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Experience the power of advanced AI conversation with our intuitive interface and powerful features.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-md">
                    <span className="text-blue-600 dark:text-blue-400">{feature.icon}</span>
                  </span>
                </div>
                <div className="mt-8 pt-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

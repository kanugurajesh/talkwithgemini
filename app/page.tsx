"use client";

import Link from "next/link";
import { FaRobot, FaMicrophone, FaHistory, FaMagic, FaBrain, FaArrowRight } from "react-icons/fa";

const features = [
  {
    title: "Voice Interaction",
    description: "Talk naturally with AI using your voice, just like talking to a friend.",
    icon: <FaMicrophone className="w-6 h-6" />,
  },
  {
    title: "Smart History",
    description: "Never lose a conversation with automatic chat history and organization.",
    icon: <FaHistory className="w-6 h-6" />,
  },
  {
    title: "AI Powered",
    description: "Powered by Google's Gemini AI for intelligent, context-aware responses.",
    icon: <FaBrain className="w-6 h-6" />,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                  <FaRobot className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text mb-6">
              Talk With Gemini
            </h1>
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10">
              Experience the future of AI conversation with voice interaction and natural dialogue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Start Chatting
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Everything you need for AI conversation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 blur"></div>
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <div className="text-blue-600 dark:text-blue-400 mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-8">
            Ready to start your AI journey?
          </h2>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            Start Chatting Now
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base text-gray-500 dark:text-gray-400">
            Created with ❤️ by{" "}
            <a
              href="https://kanugurajesh.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              Kanugu Rajesh
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

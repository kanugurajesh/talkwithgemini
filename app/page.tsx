import AudioRecorder from "./components/AudioRecorder";
import { FaRobot, FaMagic, FaBrain } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
                <FaRobot className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Talk With Gemini
            </h1>
          </div>

          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-gray-400 dark:text-gray-300 text-lg">
              <FaMagic className="w-4 h-4 text-purple-400" />
              <p>Your friendly AI companion, ready for a chat!</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaBrain className="w-4 h-4 text-blue-400" />
                <span>Powered by Gemini AI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/5 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-200/20 dark:border-gray-700/50">
            <AudioRecorder />
          </div>
        </div>
      </div>

      <footer className="mt-16 text-center py-8 border-t border-gray-200/20 dark:border-gray-700/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
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
      </footer>
    </div>
  );
}

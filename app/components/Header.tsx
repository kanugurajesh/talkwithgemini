'use client';

import { FaSun, FaMoon, FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full py-4 px-6 backdrop-blur-md bg-white/5 border-b border-gray-200/10 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-gray-200/10"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <FaSun className="w-5 h-5 text-yellow-400" />
            ) : (
              <FaMoon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/kanugurajesh"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors hover:bg-gray-200/10"
            aria-label="GitHub Profile"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/rajesh-kanugu-aba8a3254/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors hover:bg-gray-200/10"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href="https://kanugurajesh.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-colors hover:bg-gray-200/10"
            aria-label="Portfolio"
          >
            <FaGlobe className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}

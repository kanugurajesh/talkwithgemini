import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talk with Gemini",
  description: "Have a conversation with Gemini AI using voice",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen transition-colors duration-200
        dark:bg-gradient-to-br dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900
        light:bg-gradient-to-br light:from-white light:via-purple-50 light:to-white
      `}>
        <ThemeProvider>
          <Header />
          <div className="pt-16">
            {children}
          </div>
          <footer className="w-full py-6 px-4 text-center">
            <p className="text-sm text-gray-400">
              Created with ❤️ by{" "}
              <a
                href="https://kanugurajesh.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Kanugu Rajesh
              </a>
              {" "}| Full Stack Engineer
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

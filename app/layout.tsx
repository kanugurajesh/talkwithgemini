import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Talk with Gemini",
  description: "Have a natural conversation with Gemini AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200`}>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="fixed bottom-0 left-0 right-0 text-center py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200/20 dark:border-gray-700/50">
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
        </body>
      </html>
    </ThemeProvider>
  );
}

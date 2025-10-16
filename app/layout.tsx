import { CommandMenu } from "@/components/command-menu";
import { DownloadButton } from "@/components/download-button";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import type React from "react";
import { Toaster } from "sonner";

import "./globals.css";
import { CalculatorIcon } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TokenTally | All-in-One AI Cost Calculator for LLM APIs",
  description:
    "Calculate costs for OpenAI, Claude, Gemini, DALL-E, and other AI models. Compare pricing across providers and make informed decisions for your AI projects.",
  keywords:
    "AI cost calculator, LLM pricing, OpenAI cost, Claude pricing, Gemini cost, DALL-E pricing, token calculator, API cost estimation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark"
    >
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
            <div className="container flex h-14 max-w-screen-2xl items-center mx-auto">
              <div className="mr-4 hidden md:flex">
                <Link
                  href="/"
                  className="mr-6 flex items-center space-x-2 text-primary/40 hover:text-primary transition-colors duration-150"
                >
                  <CalculatorIcon className="h-6 w-6" />
                  <span className="hidden font-bold sm:inline-block">
                    TokenTally
                  </span>
                </Link>
              </div>

              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <nav className="flex justify-end w-full space-x-4 lg:space-x-6 mx-6 opacity-80 hover:opacity-100">
                  <Link
                    href="/models"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    All Models
                  </Link>
                  <Link
                    href="/models/compare"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    Compare
                  </Link>
                </nav>
                <div className="w-full flex-1 md:w-auto md:flex-none">
                  <CommandMenu />
                </div>
                <DownloadButton />
              </div>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/models"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  All Models
                </Link>
                <Link
                  href="/models/compare"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Compare
                </Link>
                <Link
                  href="/feedback"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Feedback
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                © 2025 TokenTally by{" "}
                <a
                  href="https://github.com/gfargo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  gfargo
                </a>{" "}
                ❤️{" "}
                <a
                  href="https://griffen.codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  griffen.codes
                </a>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}

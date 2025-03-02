import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Whisper & TTS Pricing Calculator | Audio AI Models | TokenTally",
  description:
    "Calculate costs for OpenAI's Whisper transcription and Text-to-Speech (TTS) models. Estimate pricing for audio processing, transcription, and voice synthesis.",
  keywords:
    "Whisper pricing, TTS cost, text-to-speech pricing, audio transcription cost, OpenAI audio models, voice synthesis",
  openGraph: {
    title: "Whisper & TTS Pricing Calculator | TokenTally",
    description: "Calculate costs for OpenAI's Whisper transcription and Text-to-Speech (TTS) models.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Audio AI Calculator")}&description=${encodeURIComponent("Calculate costs for Whisper transcription and TTS models")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Whisper & TTS Pricing Calculator | TokenTally",
    description: "Calculate costs for OpenAI's Whisper transcription and Text-to-Speech (TTS) models.",
    images: [
      `/api/og?title=${encodeURIComponent("Audio AI Calculator")}&description=${encodeURIComponent("Calculate costs for Whisper transcription and TTS models")}`,
    ],
  },
}


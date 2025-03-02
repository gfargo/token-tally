import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gemini API Pricing Calculator | Google AI Models | TokenTally",
  description:
    "Calculate costs for Gemini 2.0 Flash, Gemini 1.5 series, and other Google AI models. Estimate token pricing with our accurate, up-to-date Gemini API cost calculator.",
  keywords: "Gemini pricing, Gemini 2.0 Flash cost, Gemini 1.5 pricing, Google AI models, Gemini API calculator",
  openGraph: {
    title: "Gemini API Pricing Calculator | TokenTally",
    description:
      "Calculate costs for Gemini 2.0 Flash, Gemini 1.5 series, and other Google AI models. Estimate token pricing with our accurate, up-to-date Gemini API cost calculator.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Gemini API Pricing Calculator")}&description=${encodeURIComponent(
          "Calculate costs for Gemini 2.0 Flash, Gemini 1.5 series, and other Google AI models",
        )}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gemini API Pricing Calculator | TokenTally",
    description:
      "Calculate costs for Gemini 2.0 Flash, Gemini 1.5 series, and other Google AI models. Estimate token pricing with our accurate, up-to-date Gemini API cost calculator.",
    images: [
      `/api/og?title=${encodeURIComponent("Gemini API Pricing Calculator")}&description=${encodeURIComponent(
        "Calculate costs for Gemini 2.0 Flash, Gemini 1.5 series, and other Google AI models",
      )}`,
    ],
  },
}


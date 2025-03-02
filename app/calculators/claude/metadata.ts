import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Claude API Pricing Calculator | Anthropic Models | TokenTally",
  description:
    "Calculate costs for Claude 3 Opus, Sonnet, and Haiku models. Estimate token pricing with batch processing and prompt caching for Anthropic's LLMs.",
  keywords:
    "Claude pricing, Claude 3 Opus cost, Claude 3 Sonnet, Claude 3 Haiku, Anthropic API calculator, prompt caching",
  openGraph: {
    title: "Claude API Pricing Calculator | TokenTally",
    description:
      "Calculate costs for Claude 3 Opus, Sonnet, and Haiku models. Estimate token pricing with batch processing and prompt caching for Anthropic's LLMs.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Claude API Pricing Calculator")}&description=${encodeURIComponent(
          "Calculate costs for Claude 3 Opus, Sonnet, and Haiku models",
        )}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude API Pricing Calculator | TokenTally",
    description:
      "Calculate costs for Claude 3 Opus, Sonnet, and Haiku models. Estimate token pricing with batch processing and prompt caching for Anthropic's LLMs.",
    images: [
      `/api/og?title=${encodeURIComponent("Claude API Pricing Calculator")}&description=${encodeURIComponent(
        "Calculate costs for Claude 3 Opus, Sonnet, and Haiku models",
      )}`,
    ],
  },
}


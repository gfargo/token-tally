import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Perplexity.ai Pricing Calculator | Sonar Models | TokenTally",
  description:
    "Calculate costs for Perplexity.ai's Sonar and R1-1776 models. Estimate token pricing for input, reasoning, output, and search with our accurate calculator.",
  keywords:
    "Perplexity pricing, Sonar Deep Research cost, Sonar Reasoning, R1-1776 pricing, Perplexity.ai API calculator, search cost",
  openGraph: {
    title: "Perplexity.ai Pricing Calculator | TokenTally",
    description: "Calculate costs for Perplexity.ai's Sonar and R1-1776 models.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Perplexity Calculator")}&description=${encodeURIComponent("Calculate costs for Perplexity.ai's Sonar and R1-1776 models")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perplexity.ai Pricing Calculator | TokenTally",
    description: "Calculate costs for Perplexity.ai's Sonar and R1-1776 models.",
    images: [
      `/api/og?title=${encodeURIComponent("Perplexity Calculator")}&description=${encodeURIComponent("Calculate costs for Perplexity.ai's Sonar and R1-1776 models")}`,
    ],
  },
}


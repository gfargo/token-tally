import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cohere API Pricing Calculator | Command Models | TokenTally",
  description:
    "Calculate costs for Cohere's Command, Command Light, Command R, and Command R+ models. Estimate token pricing for input and output with our accurate calculator.",
  keywords:
    "Cohere pricing, Command model cost, Command R pricing, Command Light, Cohere API calculator, token cost estimation",
  openGraph: {
    title: "Cohere API Pricing Calculator | TokenTally",
    description: "Calculate costs for Cohere's Command, Command Light, Command R, and Command R+ models.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Cohere Calculator")}&description=${encodeURIComponent("Calculate costs for Cohere's Command models")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cohere API Pricing Calculator | TokenTally",
    description: "Calculate costs for Cohere's Command, Command Light, Command R, and Command R+ models.",
    images: [
      `/api/og?title=${encodeURIComponent("Cohere Calculator")}&description=${encodeURIComponent("Calculate costs for Cohere's Command models")}`,
    ],
  },
}


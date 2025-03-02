import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenAI GPT Pricing Calculator | TokenTally",
  description:
    "Calculate costs for GPT-4o, GPT-4.5, O1, and other OpenAI models. Estimate token pricing with our accurate, up-to-date OpenAI API cost calculator.",
  keywords:
    "OpenAI pricing, GPT-4o cost, GPT-4.5 pricing, O1 model cost, OpenAI API calculator, token cost estimation",
  openGraph: {
    title: "OpenAI GPT Pricing Calculator | TokenTally",
    description:
      "Calculate costs for GPT-4o, GPT-4.5, O1, and other OpenAI models. Estimate token pricing with our accurate, up-to-date OpenAI API cost calculator.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(
          "OpenAI GPT Pricing Calculator"
        )}&description=${encodeURIComponent(
          "Calculate costs for GPT-4o, GPT-4.5, O1, and other OpenAI models"
        )}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenAI GPT Pricing Calculator | TokenTally",
    description:
      "Calculate costs for GPT-4o, GPT-4.5, O1, and other OpenAI models. Estimate token pricing with our accurate, up-to-date OpenAI API cost calculator.",
    images: [
      `/api/og?title=${encodeURIComponent(
        "OpenAI GPT Pricing Calculator"
      )}&description=${encodeURIComponent(
        "Calculate costs for GPT-4o, GPT-4.5, O1, and other OpenAI models"
      )}`,
    ],
  },
};


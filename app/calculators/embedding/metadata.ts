import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Embedding Models Pricing Calculator | OpenAI & Cohere | TokenTally",
  description:
    "Calculate costs for embedding models from OpenAI and Cohere. Compare pricing for text-embedding-3-small, text-embedding-3-large, and multilingual embeddings.",
  keywords:
    "embedding pricing, text-embedding-3, Cohere embed, vector embeddings cost, OpenAI embeddings, multilingual embeddings",
  openGraph: {
    title: "Embedding Models Pricing Calculator | TokenTally",
    description: "Calculate costs for embedding models from OpenAI and Cohere.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Embedding Calculator")}&description=${encodeURIComponent("Calculate costs for OpenAI and Cohere embedding models")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embedding Models Pricing Calculator | TokenTally",
    description: "Calculate costs for embedding models from OpenAI and Cohere.",
    images: [
      `/api/og?title=${encodeURIComponent("Embedding Calculator")}&description=${encodeURIComponent("Calculate costs for OpenAI and Cohere embedding models")}`,
    ],
  },
}


import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DALL-E Image Generation Pricing Calculator | TokenTally",
  description:
    "Calculate costs for OpenAI's DALL-E 2 and DALL-E 3 image generation. Compare pricing across different image sizes and resolutions for AI image creation.",
  keywords: "DALL-E pricing, DALL-E 3 cost, DALL-E 2, image generation cost, AI image pricing, OpenAI image models",
  openGraph: {
    title: "DALL-E Image Generation Pricing Calculator | TokenTally",
    description: "Calculate costs for OpenAI's DALL-E 2 and DALL-E 3 image generation.",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("DALL-E Calculator")}&description=${encodeURIComponent("Calculate DALL-E 2 and DALL-E 3 image generation costs")}`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DALL-E Image Generation Pricing Calculator | TokenTally",
    description: "Calculate costs for OpenAI's DALL-E 2 and DALL-E 3 image generation.",
    images: [
      `/api/og?title=${encodeURIComponent("DALL-E Calculator")}&description=${encodeURIComponent("Calculate DALL-E 2 and DALL-E 3 image generation costs")}`,
    ],
  },
}


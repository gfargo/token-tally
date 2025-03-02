import { BaseTextModel, ImageModel } from "@/lib/models";

export const PRICING_LAST_UPDATED = "2025-03-02";

// OpenAI GPT Models
export const openaiPricing = {
  o1: {
    input: 15,
    cachedInput: 7.5,
    output: 60,
    category: "Reasoning",
    provider: "OpenAI",
    contextWindow: 200000,
  },
  "o3-mini": {
    input: 1.1,
    cachedInput: 0.55,
    output: 4.4,
    category: "Reasoning",
    provider: "OpenAI",
    contextWindow: 200000,
  },
  "gpt-4.5": {
    input: 75,
    cachedInput: 37.5,
    output: 150,
    category: "GPT",
    provider: "OpenAI",
    contextWindow: 128000,
  },
  "gpt-4o": {
    input: 2.5,
    cachedInput: 1.25,
    output: 10,
    category: "GPT",
    provider: "OpenAI",
    contextWindow: 128000,
    fineTuning: {
      input: 3.75,
      cachedInput: 1.875,
      output: 15,
      training: 25,
    },
  },
  "gpt-4o-mini": {
    input: 0.15,
    cachedInput: 0.075,
    output: 0.6,
    category: "GPT",
    provider: "OpenAI",
    contextWindow: 128000,
    fineTuning: {
      input: 0.3,
      cachedInput: 0.15,
      output: 1.2,
      training: 3,
    },
  },
  "gpt-4o-realtime": {
    input: 5,
    cachedInput: 2.5,
    output: 20,
    category: "Realtime API",
    provider: "OpenAI",
    audioInput: 40,
    audioCachedInput: 2.5,
    audioOutput: 80,
  },
  "gpt-4o-mini-realtime": {
    input: 0.6,
    cachedInput: 0.3,
    output: 2.4,
    category: "Realtime API",
    provider: "OpenAI",
    audioInput: 10,
    audioCachedInput: 0.3,
    audioOutput: 20,
  },
};

// Claude Models
export const claudePricing = {
  "claude-3-opus": {
    input: 15,
    output: 75,
    promptCachingWrite: 18.75,
    promptCachingRead: 1.5,
    category: "Text Generation",
    provider: "Anthropic",
    contextWindow: 200000,
    batchProcessingDiscount: 0.5,
  },
  "claude-3.7-sonnet": {
    input: 3,
    output: 15,
    promptCachingWrite: 3.75,
    promptCachingRead: 0.3,
    category: "Text Generation",
    provider: "Anthropic",
    contextWindow: 200000,
    batchProcessingDiscount: 0.5,
  },
  "claude-3.5-haiku": {
    input: 0.8,
    output: 4,
    promptCachingWrite: 1,
    promptCachingRead: 0.08,
    category: "Text Generation",
    provider: "Anthropic",
    contextWindow: 200000,
    batchProcessingDiscount: 0.5,
  },
};

// Gemini Models
export const geminiPricing = {
  "gemini-pro": {
    input: 0.125,
    output: 0.375,
    category: "Text Generation",
    provider: "Google",
  },
  "gemini-ultra": {
    input: 1.25,
    output: 3.75,
    category: "Text Generation",
    provider: "Google",
  },
  "gemini-2.0-flash": {
    input: { text: 0.1, image: 0.1, video: 0.1, audio: 0.7 },
    output: 0.4,
    contextCaching: { price: 0.025, storage: 1.0 },
    groundingSearch: { freeRequests: 1500, price: 35 },
    category: "Text Generation",
    provider: "Google",
    contextWindow: 1000000,
  },
  "gemini-2.0-flash-lite": {
    input: 0.075,
    output: 0.3,
    category: "Text Generation",
    provider: "Google",
  },
  "gemini-1.5-flash": {
    input: { small: 0.075, large: 0.15 },
    output: { small: 0.3, large: 0.6 },
    contextCaching: { price: { small: 0.01875, large: 0.0375 }, storage: 1.0 },
    groundingSearch: { price: 35 },
    category: "Text Generation",
    provider: "Google",
    contextWindow: 1000000,
  },
  "gemini-1.5-flash-8b": {
    input: { small: 0.0375, large: 0.075 },
    output: { small: 0.15, large: 0.3 },
    contextCaching: { price: { small: 0.01, large: 0.02 }, storage: 0.25 },
    groundingSearch: { price: 35 },
    category: "Text Generation",
    provider: "Google",
    contextWindow: 1000000,
  },
  "gemini-1.5-pro": {
    input: { small: 1.25, large: 2.5 },
    output: { small: 5.0, large: 10.0 },
    contextCaching: { price: { small: 0.3125, large: 0.625 }, storage: 4.5 },
    groundingSearch: { price: 35 },
    category: "Text Generation",
    provider: "Google",
    contextWindow: 2000000,
  },
};

export type GeminiPricingType = {
  input:
    | number
    | { text?: number; image?: number; video?: number; audio?: number }
    | { small?: number; large?: number };
  output: number | { small?: number; large?: number };
  category: string;
  provider: string;
  contextWindow?: number;
  contextCaching?: {
    price: number | { small?: number; large?: number };
    storage: number;
  };
  groundingSearch?: {
    freeRequests?: number;
    price: number;
  };
};

// DALL-E Models
export const dallePricing = {
  "dall-e-3": {
    "1024x1024": {
      price: 0.04,
      category: "Image Generation",
      provider: "OpenAI",
    },
    "1024x1792": {
      price: 0.08,
      category: "Image Generation",
      provider: "OpenAI",
    },
    "1792x1024": {
      price: 0.08,
      category: "Image Generation",
      provider: "OpenAI",
    },
  },
  "dall-e-2": {
    "1024x1024": {
      price: 0.02,
      category: "Image Generation",
      provider: "OpenAI",
    },
    "512x512": {
      price: 0.018,
      category: "Image Generation",
      provider: "OpenAI",
    },
    "256x256": {
      price: 0.016,
      category: "Image Generation",
      provider: "OpenAI",
    },
  },
};

// Embedding Models
export const embeddingPricing = {
  "text-embedding-3-small": {
    price: 0.02,
    context: "1K tokens",
    category: "Embedding",
    provider: "OpenAI",
  },
  "text-embedding-3-large": {
    price: 0.13,
    context: "8K tokens",
    category: "Embedding",
    provider: "OpenAI",
  },
  "text-embedding-ada-002": {
    price: 0.1,
    context: "8K tokens",
    category: "Embedding",
    provider: "OpenAI",
  },
  "cohere-embed-english-v3.0": {
    price: 0.1,
    context: "4K tokens",
    category: "Embedding",
    provider: "Cohere",
  },
  "cohere-embed-multilingual-v3.0": {
    price: 0.1,
    context: "4K tokens",
    category: "Embedding",
    provider: "Cohere",
  },
};

// Audio Models (Whisper & TTS)
export const audioPricing = {
  whisper: {
    price: 0.006,
    unit: "per minute",
    category: "Audio Transcription",
    provider: "OpenAI",
  },
  "tts-1": {
    price: 0.015,
    unit: "per 1K characters",
    category: "Text to Speech",
    provider: "OpenAI",
  },
  "tts-1-hd": {
    price: 0.03,
    unit: "per 1K characters",
    category: "Text to Speech",
    provider: "OpenAI",
  },
};

// Cohere Models
export const coherePricing = {
  command: {
    input: 1.0,
    output: 2.0,
    category: "Text Generation",
    provider: "Cohere",
  },
  "command-light": {
    input: 0.3,
    output: 0.6,
    category: "Text Generation",
    provider: "Cohere",
  },
  "command-r": {
    input: 3.0,
    output: 15.0,
    category: "Text Generation",
    provider: "Cohere",
  },
  "command-r-plus": {
    input: 5.0,
    output: 25.0,
    category: "Text Generation",
    provider: "Cohere",
  },
};

// Perplexity.ai Models
export const perplexityPricing = {
  "sonar-deep-research": {
    input: 2,
    reasoning: 3,
    output: 8,
    searchPrice: 5,
    category: "Text Generation",
    provider: "Perplexity.ai",
  },
  "sonar-reasoning-pro": {
    input: 2,
    output: 8,
    searchPrice: 5,
    category: "Text Generation",
    provider: "Perplexity.ai",
  },
  "sonar-reasoning": {
    input: 1,
    output: 5,
    searchPrice: 5,
    category: "Text Generation",
    provider: "Perplexity.ai",
  },
  "sonar-pro": {
    input: 3,
    output: 15,
    searchPrice: 5,
    category: "Text Generation",
    provider: "Perplexity.ai",
  },
  sonar: {
    input: 1,
    output: 1,
    searchPrice: 5,
    category: "Text Generation",
    provider: "Perplexity.ai",
  },
  "r1-1776": {
    input: 2,
    output: 8,
    category: "Text Generation",
    provider: "Perplexity.ai",
  },
} as Record<string, Omit<BaseTextModel, "model">>;

// Imagen Model
export const imagenPricing = {
  "imagen-3": {
    price: 0.03,
    category: "Image Generation",
    provider: "Google",
  },
} as Record<string, Omit<ImageModel, "model">>;

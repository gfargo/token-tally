import { z } from "zod";

// Base schemas for individual model pricing structures

/**
 * Schema for text-based models (OpenAI, Anthropic, Cohere, Perplexity)
 * Omits the "model" field as it's used as the key in the record
 */
export const BaseTextModelSchema = z.object({
  category: z.string(),
  provider: z.string(),
  unit: z.string().optional(),
  input: z.number().optional(),
  output: z.number().optional(),
  cachedInput: z.number().optional(),
  contextWindow: z.number().optional(),
  // Anthropic-specific fields
  promptCachingWrite: z.number().optional(),
  promptCachingRead: z.number().optional(),
  batchProcessingDiscount: z.number().optional(),
  // Fine-tuning
  fineTuning: z.object({
    input: z.number(),
    cachedInput: z.number(),
    output: z.number(),
    training: z.number().optional(),
  }).optional(),
  // Audio (for OpenAI realtime models)
  audioInput: z.number().optional(),
  audioCachedInput: z.number().optional(),
  audioOutput: z.number().optional(),
  // Perplexity-specific fields
  reasoning: z.number().optional(),
  searchPrice: z.number().optional(),
});

/**
 * Schema for Gemini models with complex pricing structures
 */
export const GeminiPricingSchema = z.object({
  category: z.string(),
  provider: z.string(),
  // Input can be: simple number, tiered (small/large), or multi-modal (text/image/video/audio)
  input: z.union([
    z.number(),
    z.object({
      small: z.number().optional(),
      large: z.number().optional(),
    }),
    z.object({
      text: z.number().optional(),
      image: z.number().optional(),
      video: z.number().optional(),
      audio: z.number().optional(),
    }),
  ]),
  // Output can be: simple number or tiered (small/large)
  output: z.union([
    z.number(),
    z.object({
      small: z.number().optional(),
      large: z.number().optional(),
    }),
  ]),
  contextWindow: z.number().optional(),
  // Context caching
  contextCaching: z.object({
    price: z.union([
      z.number(),
      z.object({
        small: z.number().optional(),
        large: z.number().optional(),
      }),
    ]),
    storage: z.number(),
  }).optional(),
  // Grounding search
  groundingSearch: z.object({
    freeRequests: z.number().optional(),
    price: z.number(),
  }).optional(),
});

/**
 * Schema for image generation models (DALL-E, Imagen)
 */
export const ImageModelSchema = z.object({
  price: z.number(),
  category: z.string(),
  provider: z.string(),
  unit: z.string().optional(),
});

/**
 * Schema for embedding models
 */
export const EmbeddingModelSchema = z.object({
  price: z.number(),
  context: z.string(),
  category: z.string(),
  provider: z.string(),
  unit: z.string(),
});

/**
 * Schema for audio models (Whisper, TTS)
 */
export const AudioModelSchema = z.object({
  price: z.number(),
  category: z.string(),
  provider: z.string(),
  unit: z.string(),
});

// Record schemas for provider payloads

/**
 * Schema for text pricing records (OpenAI, Anthropic, Cohere)
 */
export const TextPricingRecordSchema = z.record(
  z.string(),
  BaseTextModelSchema
);

/**
 * Schema for Perplexity pricing records
 */
export const PerplexityPricingRecordSchema = z.record(
  z.string(),
  BaseTextModelSchema
);

/**
 * Schema for Gemini pricing records
 */
export const GeminiPricingRecordSchema = z.record(
  z.string(),
  GeminiPricingSchema
);

/**
 * Schema for DALL-E pricing records (nested: model -> size -> pricing)
 */
export const DallePricingRecordSchema = z.record(
  z.string(),
  z.record(z.string(), ImageModelSchema)
);

/**
 * Schema for Imagen pricing records
 */
export const ImagenPricingRecordSchema = z.record(
  z.string(),
  ImageModelSchema
);

/**
 * Schema for embedding pricing records
 */
export const EmbeddingPricingRecordSchema = z.record(
  z.string(),
  EmbeddingModelSchema
);

/**
 * Schema for audio pricing records
 */
export const AudioPricingRecordSchema = z.record(
  z.string(),
  AudioModelSchema
);

/**
 * Complete provider payloads schema
 */
export const ProviderPayloadsSchema = z.object({
  openai: TextPricingRecordSchema,
  anthropic: TextPricingRecordSchema,
  gemini: GeminiPricingRecordSchema,
  dalle: DallePricingRecordSchema,
  embedding: EmbeddingPricingRecordSchema,
  audio: AudioPricingRecordSchema,
  cohere: TextPricingRecordSchema,
  perplexity: PerplexityPricingRecordSchema,
  imagen: ImagenPricingRecordSchema,
});

// Type exports for use in TypeScript
export type BaseTextModel = z.infer<typeof BaseTextModelSchema>;
export type GeminiPricing = z.infer<typeof GeminiPricingSchema>;
export type ImageModel = z.infer<typeof ImageModelSchema>;
export type EmbeddingModel = z.infer<typeof EmbeddingModelSchema>;
export type AudioModel = z.infer<typeof AudioModelSchema>;
export type TextPricingRecord = z.infer<typeof TextPricingRecordSchema>;
export type PerplexityPricingRecord = z.infer<typeof PerplexityPricingRecordSchema>;
export type GeminiPricingRecord = z.infer<typeof GeminiPricingRecordSchema>;
export type DallePricingRecord = z.infer<typeof DallePricingRecordSchema>;
export type ImagenPricingRecord = z.infer<typeof ImagenPricingRecordSchema>;
export type EmbeddingPricingRecord = z.infer<typeof EmbeddingPricingRecordSchema>;
export type AudioPricingRecord = z.infer<typeof AudioPricingRecordSchema>;
export type ProviderPayloads = z.infer<typeof ProviderPayloadsSchema>;

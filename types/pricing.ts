import type {
  AudioModel,
  BaseTextModel,
  EmbeddingModel,
  ImageModel,
} from "../lib/models";

export type TextPricingRecord = Record<string, Omit<BaseTextModel, "model">>;

export type DallePricingRecord = Record<
  string,
  Record<string, Omit<ImageModel, "model">>
>;

export type EmbeddingPricingRecord = Record<
  string,
  Omit<EmbeddingModel, "model">
>;

export type AudioPricingRecord = Record<string, Omit<AudioModel, "model">>;

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

export type PerplexityPricingRecord = Record<
  string,
  Omit<BaseTextModel, "model">
>;

export type ImagenPricingRecord = Record<string, Omit<ImageModel, "model">>;

export interface ProviderPayloads {
  openai: TextPricingRecord;
  anthropic: TextPricingRecord;
  gemini: Record<string, GeminiPricingType>;
  dalle: DallePricingRecord;
  embedding: EmbeddingPricingRecord;
  audio: AudioPricingRecord;
  cohere: TextPricingRecord;
  perplexity: PerplexityPricingRecord;
  imagen: ImagenPricingRecord;
}

export type ProviderKey = keyof ProviderPayloads;

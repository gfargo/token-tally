import pricingData from "@/generated/pricing.json";
import type { ProviderPayloads } from "@/types/pricing";
export type { GeminiPricingType } from "@/types/pricing";

if (!pricingData?.providers) {
  throw new Error("Generated pricing data is missing providers");
}

export const PRICING_LAST_UPDATED = (pricingData.lastUpdated ??
  "unknown") as string;

const providers = pricingData.providers as ProviderPayloads;

export const openaiPricing = providers.openai;
export const claudePricing = providers.anthropic;
export const geminiPricing = providers.gemini;
export const dallePricing = providers.dalle;
export const embeddingPricing = providers.embedding;
export const audioPricing = providers.audio;
export const coherePricing = providers.cohere;
export const perplexityPricing = providers.perplexity;
export const imagenPricing = providers.imagen;

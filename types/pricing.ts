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

export type PricingUnit =
  | "per1Mtokens"
  | "per1Ktokens"
  | "per10Ktokens"
  | "perImage"
  | "perRequest"
  | "perMinute"
  | "perHour"
  | "perSecond"
  | "perMonth"
  | "perSeat"
  | "perSeatMonthly"
  | "perCredit"
  | "perBundle"
  | "flat";

export type TokenPricingMode = {
  type: "token";
  description?: string;
  unit: Extract<PricingUnit, "per1Mtokens" | "per1Ktokens" | "per10Ktokens">;
  input?: number;
  output?: number;
  cachedInput?: number;
  min?: number;
  max?: number;
};

export type SubscriptionPricingMode = {
  type: "subscription";
  description?: string;
  unit: Extract<PricingUnit, "perMonth" | "perSeat" | "perSeatMonthly" | "flat">;
  price: number;
  seatsIncluded?: number;
  usageIncluded?: string;
  overage?: string;
  features?: string[];
};

export type CreditPricingMode = {
  type: "credit";
  description?: string;
  unit: Extract<PricingUnit, "perCredit" | "perBundle">;
  price: number;
  creditsIncluded?: number;
  usageIncluded?: string;
};

export type ComputePricingMode = {
  type: "compute";
  description?: string;
  unit: Extract<PricingUnit, "perMinute" | "perHour" | "perSecond">;
  price: number;
  usageIncluded?: string;
};

export type RangePricingMode = {
  type: "range";
  description?: string;
  unit: PricingUnit;
  min: number;
  max: number;
};

export type AdditionalPricingMode =
  | TokenPricingMode
  | SubscriptionPricingMode
  | CreditPricingMode
  | ComputePricingMode
  | RangePricingMode;

export type AdditionalProviderModel = {
  id: string;
  name: string;
  category: string;
  provider: string;
  region?: string;
  vendor?: string;
  url?: string;
  notes?: string;
  tags?: string[];
  modes: AdditionalPricingMode[];
};

export type AdditionalProviderEntry = {
  provider: string;
  catalogUrl?: string;
  models: AdditionalProviderModel[];
};

export type AdditionalProviderPayloads = Record<
  string,
  AdditionalProviderEntry
>;

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

import {
  audioPricing,
  claudePricing,
  coherePricing,
  dallePricing,
  embeddingPricing,
  geminiPricing,
  GeminiPricingType,
  imagenPricing,
  openaiPricing,
  perplexityPricing,
} from "@/config/pricing";

// Combined pricing data for global table
export type BaseTextModel = {
  model: string;
  category: string;
  provider: string;
  unit?: string;
  input?: number;
  output?: number;
  inputCost?: number;
  cachedInputCost?: number;
  outputCost?: number;
  promptCachingWriteCost?: number;
  promptCachingReadCost?: number;
  batchProcessingDiscount?: number;
  contextWindow?: number;
  reasoning?: number;
  fineTuning?: {
    input: number;
    cachedInput: number;
    output: number;
    training?: number;
  };
  audioInput?: number;
  audioCachedInput?: number;
  audioOutput?: number;
  reasoningCost?: number;
  searchPrice?: number;
};

export type ImageModel = {
  model: string;
  price: number;
  category: string;
  provider: string;
  unit?: string;
};

export type EmbeddingModel = {
  model: string;
  price: number;
  context: string;
  category: string;
  provider: string;
  unit: string;
};

export type AudioModel = {
  model: string;
  price: number;
  category: string;
  provider: string;
  unit: string;
};

export type AllModelsReturn = {
  textModels: BaseTextModel[];
  imageModels: ImageModel[];
  embeddingModels: EmbeddingModel[];
  audioModels: AudioModel[];
};

export type ModelTypeEnum =
  | BaseTextModel
  | ImageModel
  | EmbeddingModel
  | AudioModel;

export const getAllModels = (): AllModelsReturn => {
  const textModels: BaseTextModel[] = [
    ...Object.entries(openaiPricing).map(
      ([model, data]: [string, Partial<BaseTextModel>]) => ({
        model,
        inputCost: data.input,
        outputCost: data.output,
        category: data.category!,
        provider: data.provider!,
        contextWindow: data.contextWindow,
        unit: "per 1M tokens",
        fineTuning: data.fineTuning,
        audioInput: data.audioInput,
        audioCachedInput: data.audioCachedInput,
        audioOutput: data.audioOutput,
      })
    ),
    ...Object.entries(claudePricing).map(([model, data]) => ({
      model,
      inputCost: data.input,
      outputCost: data.output,
      promptCachingWriteCost: data.promptCachingWrite,
      promptCachingReadCost: data.promptCachingRead,
      category: data.category!,
      provider: data.provider!,
      contextWindow: data.contextWindow,
      batchProcessingDiscount: data.batchProcessingDiscount,
      unit: "per 1M tokens",
    })),
    ...Object.entries(geminiPricing).map(
      ([model, data]: [string, GeminiPricingType]) => ({
        model,
        inputCost:
          typeof data.input === "number"
            ? data.input
            : "text" in data.input
            ? data.input.text!
            : "small" in data.input
            ? data.input.small!
            : 0,
        outputCost:
          typeof data.output === "number" ? data.output : data.output.small!,
        category: data.category!,
        provider: data.provider!,
        contextWindow: data.contextWindow,
        unit: "per 1M tokens",
      })
    ),
    ...Object.entries(coherePricing).map(([model, data]) => ({
      model,
      inputCost: data.input,
      outputCost: data.output,
      category: data.category!,
      provider: data.provider!,
      unit: "per 1M tokens",
    })),
  ];

  // Image generation models
  const imageModels: ImageModel[] = [
    ...Object.entries(dallePricing).flatMap(([model, sizes]) =>
      Object.entries(sizes).map(([size, data]) => ({
        model: `${model} (${size})`,
        price: data.price,
        category: data.category,
        provider: data.provider,
        unit: "per image",
      }))
    ),
  ];

  const imagenModels: ImageModel[] = Object.entries(imagenPricing).map(
    ([model, data]) => ({
      model,
      price: data.price,
      category: data.category,
      provider: data.provider,
      unit: "per image",
    })
  );

  // Embedding models
  const embeddingModels: EmbeddingModel[] = Object.entries(
    embeddingPricing
  ).map(([model, data]) => ({
    model,
    price: data.price,
    context: data.context,
    category: data.category,
    provider: data.provider,
    unit: "per 1M tokens",
  }));

  // Audio models
  const audioModels: AudioModel[] = Object.entries(audioPricing).map(
    ([model, data]) => ({
      model,
      price: data.price,
      category: data.category,
      provider: data.provider,
      unit: data.unit,
    })
  );

  const perplexityModels: BaseTextModel[] = Object.entries(
    perplexityPricing
  ).map(([model, data]) => ({
    model,
    inputCost: data.input,
    reasoningCost: data.reasoning,
    outputCost: data.output,
    searchPrice: data.searchPrice,
    category: data.category!,
    provider: data.provider!,
    unit: "per 1M tokens",
  }));

  const geminiModels: BaseTextModel[] = Object.entries(geminiPricing).map(
    ([model, data]: [string, GeminiPricingType]) => ({
      model,
      inputCost:
        typeof data.input === "number"
          ? data.input
          : "text" in data.input
          ? data.input.text!
          : "small" in data.input
          ? data.input.small!
          : 0,
      outputCost:
        typeof data.output === "number" ? data.output : data.output.small!,
      category: data.category!,
      provider: data.provider!,
      contextWindow: data.contextWindow,
      unit: "per 1M tokens",
    })
  );

  return {
    textModels: [...textModels, ...perplexityModels, ...geminiModels],
    imageModels: [...imageModels, ...imagenModels],
    embeddingModels,
    audioModels,
  };
};

export const filterModels = (
  models: ModelTypeEnum[],
  searchTerm: string,
  provider: string,
  category: string
) => {
  return models.filter(
    (model) =>
      model.model.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (provider === "all" || model.provider === provider) &&
      (category === "all" || model.category === category)
  );
};
export const getTopModels = (
  models: ModelTypeEnum[],
  metric: string,
  limit = 10
) => {
  return models
    .filter((model) => {
      const value = model[metric as keyof ModelTypeEnum];
      return typeof value === "number" && !isNaN(value);
    })
    .sort((a, b) => {
      const valueA = a[metric as keyof ModelTypeEnum];
      const valueB = b[metric as keyof ModelTypeEnum];
      return typeof valueA === "number" && typeof valueB === "number"
        ? valueB - valueA
        : 0;
    })
    .slice(0, limit);
};

export const getUniqueProviders = () => {
  const allData = getAllModels();
  const providers = new Set<string>();

  allData.textModels.forEach((model) => providers.add(model.provider));
  allData.imageModels.forEach((model) => providers.add(model.provider));
  allData.embeddingModels.forEach((model) => providers.add(model.provider));
  allData.audioModels.forEach((model) => providers.add(model.provider));

  return Array.from(providers);
};

export const getUniqueCategories = () => {
  const allData = getAllModels();
  const categories = new Set<string>();

  allData.textModels.forEach((model) => categories.add(model.category));
  allData.imageModels.forEach((model) => categories.add(model.category));
  allData.embeddingModels.forEach((model) => categories.add(model.category));
  allData.audioModels.forEach((model) => categories.add(model.category));

  return Array.from(categories);
};

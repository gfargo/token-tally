import type { AdditionalPricingRow } from "@/lib/additional-models";
import type {
  AllModelsReturn,
  AudioModel,
  BaseTextModel,
  EmbeddingModel,
  ImageModel,
} from "@/lib/models";

type NumericStat<T extends BaseTextModel | ImageModel | EmbeddingModel | AudioModel> = {
  model: string;
  value: number;
  unit?: string;
  extra?: number;
};

type ModeCounts = {
  token: number;
  subscription: number;
  credit: number;
  compute: number;
  range: number;
};

export type ProviderSummary = {
  provider: string;
  textModels: BaseTextModel[];
  imageModels: ImageModel[];
  embeddingModels: EmbeddingModel[];
  audioModels: AudioModel[];
  curatedEntries: AdditionalPricingRow[];
};

export type ProviderStats = {
  textModelCount: number;
  minInputCost?: NumericStat<BaseTextModel>;
  minOutputCost?: NumericStat<BaseTextModel>;
  maxContextWindow?: NumericStat<BaseTextModel>;
  bestTokenEfficiency?: {
    model: string;
    tokensPerDollar: number;
  };
  curatedEntryCount: number;
  modeCounts: ModeCounts;
  vendors: string[];
};

const toNumber = (value: unknown): number | undefined =>
  typeof value === "number" && !Number.isNaN(value) ? value : undefined;

const collectNumericStat = (
  models: BaseTextModel[],
  selector: (model: BaseTextModel) => number | undefined,
  unit?: string
): NumericStat<BaseTextModel> | undefined => {
  const candidates = models
    .map((model) => {
      const value = selector(model);
      return value !== undefined ? { model: model.model, value, unit } : null;
    })
    .filter((candidate): candidate is NumericStat<BaseTextModel> => candidate !== null);

  if (candidates.length === 0) {
    return undefined;
  }

  return candidates.reduce((prev, current) =>
    current.value < prev.value ? current : prev
  );
};

const collectMaxContextWindow = (
  models: BaseTextModel[]
): NumericStat<BaseTextModel> | undefined => {
  const candidates = models
    .map((model) => {
      const value = toNumber(model.contextWindow);
      return value !== undefined
        ? { model: model.model, value, unit: "tokens" }
        : null;
    })
    .filter((candidate): candidate is NumericStat<BaseTextModel> => candidate !== null);

  if (candidates.length === 0) {
    return undefined;
  }

  return candidates.reduce((prev, current) =>
    current.value > prev.value ? current : prev
  );
};

const collectBestTokenEfficiency = (
  models: BaseTextModel[]
): { model: string; tokensPerDollar: number } | undefined => {
  const candidates = models
    .map((model) => {
      const inputCost = toNumber(model.inputCost);
      if (!inputCost || inputCost <= 0) {
        return null;
      }
      return {
        model: model.model,
        tokensPerDollar: Math.round(1_000_000 / inputCost),
      };
    })
    .filter(
      (
        candidate
      ): candidate is { model: string; tokensPerDollar: number } =>
        candidate !== null
    );

  if (candidates.length === 0) {
    return undefined;
  }

  return candidates.reduce((prev, current) =>
    current.tokensPerDollar > prev.tokensPerDollar ? current : prev
  );
};

const defaultModeCounts: ModeCounts = {
  token: 0,
  subscription: 0,
  credit: 0,
  compute: 0,
  range: 0,
};

const collectModeCounts = (entries: AdditionalPricingRow[]): ModeCounts => {
  return entries.reduce((acc, entry) => {
    entry.modes.forEach((mode) => {
      acc[mode.type] = (acc[mode.type] ?? 0) + 1;
    });
    return acc;
  }, { ...defaultModeCounts });
};

const collectVendors = (entries: AdditionalPricingRow[]): string[] => {
  const vendors = new Set<string>();
  entries.forEach((entry) => {
    if (entry.vendor) {
      vendors.add(entry.vendor);
    }
  });
  return Array.from(vendors);
};

export const listProviderNames = (
  allModels: AllModelsReturn,
  additionalCatalog: AdditionalPricingRow[]
): string[] => {
  const names = new Set<string>();
  const addProvider = (provider?: string) => {
    if (provider) {
      names.add(provider);
    }
  };

  allModels.textModels.forEach((model) => addProvider(model.provider));
  allModels.imageModels.forEach((model) => addProvider(model.provider));
  allModels.embeddingModels.forEach((model) => addProvider(model.provider));
  allModels.audioModels.forEach((model) => addProvider(model.provider));
  additionalCatalog.forEach((entry) => addProvider(entry.provider));

  return Array.from(names).sort((a, b) => a.localeCompare(b));
};

const filterTextModels = (models: BaseTextModel[], provider: string) =>
  models.filter((model) => model.provider === provider);
const filterImageModels = (models: ImageModel[], provider: string) =>
  models.filter((model) => model.provider === provider);
const filterEmbeddingModels = (models: EmbeddingModel[], provider: string) =>
  models.filter((model) => model.provider === provider);
const filterAudioModels = (models: AudioModel[], provider: string) =>
  models.filter((model) => model.provider === provider);
const filterCuratedEntries = (
  entries: AdditionalPricingRow[],
  provider: string
) => entries.filter((entry) => entry.provider === provider);

export const getProviderSummary = (
  provider: string,
  allModels: AllModelsReturn,
  additionalCatalog: AdditionalPricingRow[]
): ProviderSummary => ({
  provider,
  textModels: filterTextModels(allModels.textModels, provider),
  imageModels: filterImageModels(allModels.imageModels, provider),
  embeddingModels: filterEmbeddingModels(allModels.embeddingModels, provider),
  audioModels: filterAudioModels(allModels.audioModels, provider),
  curatedEntries: filterCuratedEntries(additionalCatalog, provider),
});

export const summarizeProviderStats = (
  summary: ProviderSummary
): ProviderStats => {
  const minInputCost = collectNumericStat(
    summary.textModels,
    (model) => toNumber(model.inputCost),
    "per 1M tokens"
  );
  const minOutputCost = collectNumericStat(
    summary.textModels,
    (model) => toNumber(model.outputCost),
    "per 1M tokens"
  );
  const maxContextWindow = collectMaxContextWindow(summary.textModels);
  const bestTokenEfficiency = collectBestTokenEfficiency(summary.textModels);
  const curatedEntryCount = summary.curatedEntries.length;
  const modeCounts = collectModeCounts(summary.curatedEntries);
  const vendors = collectVendors(summary.curatedEntries);

  return {
    textModelCount: summary.textModels.length,
    minInputCost: minInputCost ?? undefined,
    minOutputCost: minOutputCost ?? undefined,
    maxContextWindow: maxContextWindow ?? undefined,
    bestTokenEfficiency: bestTokenEfficiency ?? undefined,
    curatedEntryCount,
    modeCounts,
    vendors,
  };
};

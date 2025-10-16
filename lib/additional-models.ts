import {
  extendedProviderCatalog,
  PRICING_LAST_UPDATED,
} from "@/config/pricing";
import type {
  AdditionalPricingMode,
  AdditionalProviderEntry,
} from "@/types/pricing";

export type AdditionalPricingRow = {
  providerKey: string;
  provider: string;
  modelId: string;
  name: string;
  category: string;
  vendor?: string;
  region?: string;
  url?: string;
  notes?: string;
  tags?: string[];
  modes: AdditionalPricingMode[];
  catalogUrl?: string;
  lastUpdated: string;
};

const normaliseEntry = (
  providerKey: string,
  entry: AdditionalProviderEntry
): AdditionalPricingRow[] => {
  if (!entry?.models?.length) {
    return [];
  }

  return entry.models.map((model) => ({
    providerKey,
    provider: entry.provider,
    catalogUrl: entry.catalogUrl,
    modelId: model.id,
    name: model.name,
    category: model.category,
    vendor: model.vendor,
    region: model.region,
    url: model.url,
    notes: model.notes,
    tags: model.tags,
    modes: model.modes,
    lastUpdated: PRICING_LAST_UPDATED,
  }));
};

export const getAdditionalPricingCatalog = (): AdditionalPricingRow[] => {
  return Object.entries(extendedProviderCatalog).flatMap(([key, entry]) =>
    normaliseEntry(key, entry)
  );
};

export const filterAdditionalCatalog = (
  catalog: AdditionalPricingRow[],
  {
    searchTerm,
    provider,
    category,
  }: { searchTerm?: string; provider?: string; category?: string }
) => {
  const loweredSearch = searchTerm?.toLowerCase() ?? "";
  return catalog.filter((item) => {
    const matchesSearch =
      !loweredSearch ||
      item.name.toLowerCase().includes(loweredSearch) ||
      item.modelId.toLowerCase().includes(loweredSearch) ||
      item.provider.toLowerCase().includes(loweredSearch) ||
      (item.vendor?.toLowerCase().includes(loweredSearch) ?? false);

    const matchesProvider =
      !provider ||
      provider === "all" ||
      item.provider === provider ||
      item.providerKey === provider;

    const matchesCategory =
      !category || category === "all" || item.category === category;

    return matchesSearch && matchesProvider && matchesCategory;
  });
};

const providerMap: { [key: string]: string } = {
  "Perplexity.ai": "perplexity",
  // Add more mappings here if needed
};

export function getCalculatorUrl(provider: string): string {
  const normalizedProvider = provider.toLowerCase();
  return `/calculators/${providerMap[provider] || normalizedProvider}`;
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function getProviderSlug(provider: string): string {
  const override = providerMap[provider];
  if (override) {
    return slugify(override);
  }
  const slug = slugify(provider);
  return slug || "provider";
}

export function getProviderDetailUrl(provider: string): string {
  return `/models/${getProviderSlug(provider)}`;
}

import type { TextPricingRecord } from "../../../types/pricing";
import { TextPricingRecordSchema } from "../../schemas/pricing";
import { validatePricingSafe } from "../../utils/validate";

const PROVIDER = "Cohere";
const CATEGORY = "Text Generation";

const parseCurrency = (value: string): number | undefined => {
  const cleaned = value.trim();
  if (!cleaned || cleaned === "-" || cleaned.toLowerCase() === "n/a") {
    return undefined;
  }

  // Match patterns like "$1.00" or "$0.30"
  const match = cleaned.replace(/[,]/g, "").match(/\$([0-9]*\.?[0-9]+)/);
  return match ? Number(match[1]) : undefined;
};

const normalizeModelName = (displayName: string): string => {
  // Convert "Command" -> "command"
  // Convert "Command-light" -> "command-light"
  // Convert "Command R 03-2024" -> "command-r"
  // Convert "Command R+ 04-2024" -> "command-r-plus"
  // Convert "Command R+ 08-2024" -> "command-r-plus"
  // Convert "Aya Expanse 8B" -> "aya-expanse-8b"
  // Convert "Aya Expanse 32B" -> "aya-expanse-32b"

  // Remove markdown list markers (* or -) and leading/trailing whitespace
  const cleaned = displayName.replace(/^[*\-]\s+/, "").trim();
  const lower = cleaned.toLowerCase();

  // Remove date suffixes (03-2024, 04-2024, etc.)
  const withoutDate = lower.replace(/\s+\d{2}-\d{4}/g, "");

  // Replace spaces and + with dashes
  const normalized = withoutDate
    .replace(/\s+/g, "-")
    .replace(/\+/g, "-plus");

  return normalized;
};

export const parseCohereMarkdown = (markdown: string): TextPricingRecord => {
  const lines = markdown.split("\n");
  const models: TextPricingRecord = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for pricing patterns in FAQ section:
    // "Command pricing is $1.00/1M tokens for input and $2.00/1M tokens for output"
    // "Command R+ 08-2024 pricing is $2.50/1M tokens for input and $10.00/1M tokens for output"
    // "Aya Expanse models (8B and 32B) on the API are charged at $0.50/1M tokens for input and $1.50/1M tokens for output"

    const pricingMatch = line.match(/^(.*?)\s+pricing\s+is\s+\$([0-9.]+)\/1M\s+tokens\s+for\s+input\s+and\s+\$([0-9.]+)\/1M\s+tokens\s+for\s+output/i);
    if (pricingMatch) {
      const modelDisplay = pricingMatch[1].trim();
      const input = Number(pricingMatch[2]);
      const output = Number(pricingMatch[3]);

      const modelKey = normalizeModelName(modelDisplay);

      models[modelKey] = {
        provider: PROVIDER,
        category: CATEGORY,
        input,
        output,
      };
      continue;
    }

    // Also handle the Aya Expanse special format:
    // "Aya Expanse models (8B and 32B) on the API are charged at $0.50/1M tokens for input and $1.50/1M tokens for output"
    const ayaMatch = line.match(/Aya\s+Expanse\s+models\s+\(8B\s+and\s+32B\).*?\$([0-9.]+)\/1M\s+tokens\s+for\s+input\s+and\s+\$([0-9.]+)\/1M\s+tokens\s+for\s+output/i);
    if (ayaMatch) {
      const input = Number(ayaMatch[1]);
      const output = Number(ayaMatch[2]);

      // Create entries for both 8B and 32B
      models["aya-expanse-8b"] = {
        provider: PROVIDER,
        category: CATEGORY,
        input,
        output,
      };
      models["aya-expanse-32b"] = {
        provider: PROVIDER,
        category: CATEGORY,
        input,
        output,
      };
      continue;
    }
  }

  // If we didn't find any models, throw an error
  if (Object.keys(models).length === 0) {
    throw new Error("Failed to parse any Cohere models from pricing page");
  }

  return validatePricingSafe(models, TextPricingRecordSchema, "cohere");
};

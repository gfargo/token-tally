import type { TextPricingRecord } from "../../../types/pricing";
import { TextPricingRecordSchema } from "../../schemas/pricing";
import { validatePricingSafe } from "../../utils/validate";

const PROVIDER = "Anthropic";
const CATEGORY = "Text Generation";
const CONTEXT_WINDOW = 200000;
const BATCH_DISCOUNT = 0.5;

const parseCurrency = (value: string): number | undefined => {
  const cleaned = value.trim();
  if (!cleaned || cleaned === "-" || cleaned.toLowerCase() === "n/a") {
    return undefined;
  }

  // Match patterns like "$15 / MTok" or "$0.80 / MTok"
  const match = cleaned.replace(/[,]/g, "").match(/\$([0-9]*\.?[0-9]+)/);
  return match ? Number(match[1]) : undefined;
};

const normalizeModelName = (displayName: string): string => {
  // Convert "Claude Opus 4.1" -> "claude-opus-4-1"
  // Convert "Claude Sonnet 3.7" -> "claude-3-7-sonnet"
  // Convert "Claude Haiku 3.5" -> "claude-3-5-haiku"

  const lower = displayName.toLowerCase().trim();

  // Remove any markdown links, deprecated tags, or trailing punctuation
  const clean = lower
    .replace(/\s*\(\[deprecated\].*?\)\s*/g, "")
    .replace(/[)\]]+$/g, "") // Remove trailing ) or ]
    .trim();

  // Handle different model families
  if (clean.includes("opus")) {
    // "claude opus 4.1" -> "claude-opus-4-1"
    return clean.replace(/\s+/g, "-").replace(/\./g, "-");
  } else if (clean.includes("sonnet")) {
    // Special case for older naming: "claude sonnet 3.7" -> "claude-3-7-sonnet"
    const versionMatch = clean.match(/(\d+\.?\d*)/);
    if (versionMatch) {
      const version = versionMatch[1];
      if (parseFloat(version) < 4) {
        // Older models: "claude-3-7-sonnet"
        return `claude-${version.replace(".", "-")}-sonnet`;
      } else {
        // Newer models: "claude-sonnet-4-5"
        return `claude-sonnet-${version.replace(".", "-")}`;
      }
    }
  } else if (clean.includes("haiku")) {
    // "claude haiku 3.5" -> "claude-3-5-haiku"
    const versionMatch = clean.match(/(\d+\.?\d*)/);
    if (versionMatch) {
      const version = versionMatch[1];
      return `claude-${version.replace(".", "-")}-haiku`;
    }
  }

  // Fallback: just replace spaces with dashes
  return clean.replace(/\s+/g, "-").replace(/\./g, "-");
};

const splitTableRow = (row: string): string[] => {
  const trimmed = row.trim();
  if (!trimmed.startsWith("|")) {
    return [];
  }
  return trimmed
    .slice(1, trimmed.endsWith("|") ? -1 : undefined)
    .split("|")
    .map((cell) => cell.trim());
};

export const parseAnthropicMarkdown = (markdown: string): TextPricingRecord => {
  const lines = markdown.split("\n");
  const models: TextPricingRecord = {};
  let inPricingSection = false;
  let pricingTableStart = -1;

  // Find the "Model pricing" section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("### Model pricing")) {
      inPricingSection = true;
      continue;
    }

    if (inPricingSection && line.startsWith("|") && line.includes("Model")) {
      pricingTableStart = i;
      break;
    }
  }

  if (pricingTableStart === -1) {
    throw new Error("Failed to find Anthropic pricing table in documentation");
  }

  // Parse the pricing table
  const rows: string[][] = [];
  for (let i = pricingTableStart; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith("|")) {
      break; // End of table
    }
    const cells = splitTableRow(line);
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  if (rows.length < 3) {
    throw new Error("Anthropic pricing table has insufficient rows");
  }

  const header = rows[0].map((cell) => cell.toLowerCase());
  // Expected columns: Model | Base Input Tokens | 5m Cache Writes | 1h Cache Writes | Cache Hits & Refreshes | Output Tokens

  const modelIndex = header.findIndex((h) => h.includes("model"));
  const inputIndex = header.findIndex((h) => h.includes("base input") || h.includes("input tokens"));
  const cache5mIndex = header.findIndex((h) => h.includes("5m cache"));
  const cacheHitsIndex = header.findIndex((h) => h.includes("cache hits") || h.includes("refreshes"));
  const outputIndex = header.findIndex((h) => h.includes("output"));

  if (modelIndex === -1 || inputIndex === -1 || outputIndex === -1) {
    throw new Error("Failed to find required columns in Anthropic pricing table");
  }

  // Skip the header and separator rows (rows 0 and 1)
  for (let rowIdx = 2; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    const modelDisplayName = row[modelIndex];
    if (!modelDisplayName || modelDisplayName === "---") {
      continue;
    }

    const modelKey = normalizeModelName(modelDisplayName);
    const input = parseCurrency(row[inputIndex] ?? "");
    const output = parseCurrency(row[outputIndex] ?? "");
    const cacheWrite = cache5mIndex !== -1 ? parseCurrency(row[cache5mIndex] ?? "") : undefined;
    const cacheRead = cacheHitsIndex !== -1 ? parseCurrency(row[cacheHitsIndex] ?? "") : undefined;

    // Use type assertion to match runtime JSON structure (not TypeScript type)
    models[modelKey] = {
      provider: PROVIDER,
      category: CATEGORY,
      input,
      output,
      promptCachingWrite: cacheWrite,
      promptCachingRead: cacheRead,
      contextWindow: CONTEXT_WINDOW,
      batchProcessingDiscount: BATCH_DISCOUNT,
    } as any;
  }

  if (Object.keys(models).length === 0) {
    throw new Error("Failed to parse any Anthropic models from pricing table");
  }

  return validatePricingSafe(models, TextPricingRecordSchema, "anthropic");
};

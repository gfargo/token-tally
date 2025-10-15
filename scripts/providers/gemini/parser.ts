import type { GeminiPricingType } from "../../../types/pricing";
import { GeminiPricingRecordSchema } from "../../schemas/pricing";
import { validatePricingSafe } from "../../utils/validate";

const PROVIDER = "Google";
const CATEGORY = "Text Generation";

const parseCurrency = (value: string): number | undefined => {
  const cleaned = value.trim();
  if (!cleaned || cleaned === "-" || cleaned.toLowerCase().includes("not available") || cleaned.toLowerCase().includes("free of charge")) {
    return undefined;
  }

  // Match patterns like "$0.30" or "$1.25"
  const match = cleaned.replace(/[,]/g, "").match(/\$([0-9]*\.?[0-9]+)/);
  return match ? Number(match[1]) : undefined;
};

const parseMultiModalInput = (value: string): number | { text?: number; image?: number; video?: number; audio?: number } | { small?: number; large?: number } | undefined => {
  const cleaned = value.trim().toLowerCase();

  if (!cleaned || cleaned.includes("not available") || cleaned.includes("free of charge")) {
    return undefined;
  }

  // Check for tiered pattern first (takes precedence): "$1.25, prompts <= 200k tokens $2.50, prompts > 200k tokens"
  const tieredMatch = cleaned.match(/\$([0-9.]+)[^$]*<=\s*200k[^$]*\$([0-9.]+)[^$]*>\s*200k/);
  if (tieredMatch) {
    return {
      small: Number(tieredMatch[1]),
      large: Number(tieredMatch[2])
    };
  }

  // Check for multi-modal pattern: "$0.30 (text / image / video) $1.00 (audio)"
  const multiModalMatch = cleaned.match(/\$([0-9.]+)\s*\([^)]*text[^)]*\)[^$]*\$([0-9.]+)\s*\(audio\)/);
  if (multiModalMatch) {
    const textImageVideo = Number(multiModalMatch[1]);
    const audio = Number(multiModalMatch[2]);
    return { text: textImageVideo, image: textImageVideo, video: textImageVideo, audio };
  }

  // Simple single price
  const singlePrice = parseCurrency(value);
  return singlePrice;
};

const parseTieredPrice = (value: string): number | { small?: number; large?: number } | undefined => {
  const cleaned = value.trim().toLowerCase();

  if (!cleaned || cleaned.includes("not available") || cleaned.includes("free of charge")) {
    return undefined;
  }

  // Check for tiered pattern: "$1.25, prompts <= 200k tokens $2.50, prompts > 200k tokens"
  const tieredMatch = cleaned.match(/\$([0-9.]+)[^$]*<=\s*200k[^$]*\$([0-9.]+)[^$]*>\s*200k/);
  if (tieredMatch) {
    return {
      small: Number(tieredMatch[1]),
      large: Number(tieredMatch[2])
    };
  }

  // Simple single price
  const singlePrice = parseCurrency(value);
  return singlePrice;
};

const parseContextCaching = (value: string): { price: number | { small?: number; large?: number }; storage: number } | undefined => {
  const cleaned = value.trim().toLowerCase();

  if (!cleaned || cleaned.includes("not available") || cleaned.includes("free of charge")) {
    return undefined;
  }

  // Extract storage price (always at the end): "$1.00 / 1,000,000 tokens per hour (storage price)"
  const storageMatch = cleaned.match(/\$([0-9.]+)\s*\/\s*1,?000,?000\s*tokens\s*per\s*hour/);
  const storage = storageMatch ? Number(storageMatch[1]) : 1; // Default to 1 if not found

  // Check for multi-modal cache pricing: "$0.03 (text / image / video) $0.1 (audio)"
  const multiModalMatch = cleaned.match(/\$([0-9.]+)\s*\([^)]*text[^)]*\)[^$]*\$([0-9.]+)\s*\(audio\)/);
  if (multiModalMatch) {
    // For multi-modal, we'll just use the text/image/video price as the base price
    return { price: Number(multiModalMatch[1]), storage };
  }

  // Check for tiered pattern: "$0.125, prompts <= 200k tokens $0.25, prompts > 200k"
  const tieredMatch = cleaned.match(/\$([0-9.]+)[^$]*<=\s*200k[^$]*\$([0-9.]+)[^$]*>\s*200k/);
  if (tieredMatch) {
    return {
      price: { small: Number(tieredMatch[1]), large: Number(tieredMatch[2]) },
      storage
    };
  }

  // Simple single price (first price in the string)
  const firstPrice = parseCurrency(value);
  if (firstPrice !== undefined) {
    return { price: firstPrice, storage };
  }

  return undefined;
};

const parseGroundingSearch = (value: string): { freeRequests?: number; price: number } | undefined => {
  const cleaned = value.trim().toLowerCase();

  if (!cleaned || cleaned.includes("not available") || cleaned === "not available") {
    return undefined;
  }

  // Pattern: "1,500 RPD (free), then $35 / 1,000 requests"
  const freeMatch = cleaned.match(/([0-9,]+)\s*rpd/);
  const priceMatch = cleaned.match(/\$([0-9.]+)\s*\/\s*1,?000\s*requests/);

  const freeRequests = freeMatch ? Number(freeMatch[1].replace(/,/g, "")) : undefined;
  const price = priceMatch ? Number(priceMatch[1]) : 35; // Default to 35

  if (price === undefined) {
    return undefined;
  }

  return { freeRequests, price };
};

const normalizeModelName = (displayName: string): string => {
  // Convert "Gemini 2.5 Pro" -> "gemini-2.5-pro"
  // Convert "Gemini 2.0 Flash" -> "gemini-2.0-flash"
  // Convert "Gemini 1.5 Flash-8B" -> "gemini-1.5-flash-8b"

  const lower = displayName.toLowerCase().trim();

  // Remove underscores and extra info
  const clean = lower
    .replace(/^_|_$/g, "") // Remove leading/trailing underscores
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/\u2013|\u2014/g, "-") // Replace en-dash/em-dash with hyphen
    .trim();

  return clean;
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

// Map descriptions/sections to model names based on order and content
const inferModelName = (description: string, existingModels: string[]): string | null => {
  const lower = description.toLowerCase();

  if (lower.includes("state-of-the-art multipurpose") && lower.includes("coding")) {
    return existingModels.includes("gemini-2.5-pro") ? null : "gemini-2.5-pro";
  }
  if (lower.includes("hybrid reasoning") && lower.includes("thinking budgets")) {
    return existingModels.includes("gemini-2.5-flash") ? null : "gemini-2.5-flash";
  }
  if (lower.includes("latest model based on") && lower.includes("2.5 flash preview")) {
    return existingModels.includes("gemini-2.5-flash-preview") ? null : "gemini-2.5-flash-preview";
  }
  if (lower.includes("smallest and most cost effective")) {
    // Could be Flash-Lite or 1.5 Flash-8B - check which one we haven't seen
    if (!existingModels.includes("gemini-2.5-flash-lite")) {
      return "gemini-2.5-flash-lite";
    }
    if (!existingModels.includes("gemini-1.5-flash-8b")) {
      return "gemini-1.5-flash-8b";
    }
  }
  if (lower.includes("balanced multimodal") && lower.includes("1 million token")) {
    return existingModels.includes("gemini-2.0-flash") ? null : "gemini-2.0-flash";
  }
  if (lower.includes("computer use") && lower.includes("browser control")) {
    return existingModels.includes("gemini-2.5-computer-use-preview") ? null : "gemini-2.5-computer-use-preview";
  }

  return null;
};

export const parseGeminiMarkdown = (markdown: string): Record<string, GeminiPricingType> => {
  const lines = markdown.split("\n");
  const models: Record<string, GeminiPricingType> = {};

  let currentModel: string | null = null;
  let inTable = false;
  let tableData: Record<string, string> = {};
  let lastDescription = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Try to detect model IDs (if present)
    const modelIdMatch = line.match(/_`([^`]+)`_/);
    if (modelIdMatch) {
      const modelId = modelIdMatch[1];

      // Skip non-text models
      if (
        modelId.includes("tts") ||
        modelId.includes("imagen") ||
        modelId.includes("veo") ||
        modelId.includes("embedding") ||
        modelId.includes("live-api") ||
        modelId.includes("gemma")
      ) {
        currentModel = null;
        continue;
      }

      currentModel = modelId;
      tableData = {};
      inTable = false;
      lastDescription = "";
      continue;
    }

    // Store description lines (to infer model names when IDs aren't present)
    if (!line.startsWith("|") && !line.includes("---") && line.length > 20 && line.length < 200) {
      lastDescription = line;
    }

    // Start of a pricing table
    if (line.startsWith("|") && line.includes("Free Tier") && line.includes("Paid Tier")) {
      // If no current model, try to infer from description
      if (!currentModel && lastDescription) {
        const inferredName = inferModelName(lastDescription, Object.keys(models));
        if (inferredName) {
          currentModel = inferredName;
          tableData = {};
        }
      }

      inTable = true;
      continue;
    }

    // Parse table rows
    if (currentModel && inTable && line.startsWith("|")) {
      const cells = splitTableRow(line);
      if (cells.length >= 2 && cells[0] && !cells[0].includes("---")) {
        const label = cells[0].trim();
        const paidValue = cells[2] || cells[1] || ""; // Paid Tier is usually column 2 (index 2)

        // Store key pricing rows
        if (label.toLowerCase().includes("input price")) {
          tableData["input"] = paidValue;
        } else if (label.toLowerCase().includes("output price")) {
          tableData["output"] = paidValue;
        } else if (label.toLowerCase().includes("context caching price")) {
          tableData["contextCaching"] = paidValue;
        } else if (label.toLowerCase().includes("grounding with google search")) {
          tableData["grounding"] = paidValue;
        } else if (label.toLowerCase().includes("used to improve")) {
          // End of table, process collected data
          inTable = false;

          if (tableData["input"] && tableData["output"]) {
            const input = parseMultiModalInput(tableData["input"]);
            const output = parseTieredPrice(tableData["output"]);
            const contextCaching = tableData["contextCaching"] ? parseContextCaching(tableData["contextCaching"]) : undefined;
            const groundingSearch = tableData["grounding"] ? parseGroundingSearch(tableData["grounding"]) : undefined;

            if (input !== undefined && output !== undefined) {
              models[currentModel] = {
                provider: PROVIDER,
                category: CATEGORY,
                input,
                output,
                contextCaching,
                groundingSearch,
                contextWindow: 1000000, // Most Gemini models have 1M context
              };
            }
          }

          tableData = {};
          currentModel = null; // Reset for next model
          lastDescription = "";
        }
      }
    }
  }

  if (Object.keys(models).length === 0) {
    throw new Error("Failed to parse any Gemini models from pricing page");
  }

  return validatePricingSafe(models, GeminiPricingRecordSchema, "gemini");
};

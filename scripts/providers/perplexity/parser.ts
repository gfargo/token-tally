import type { PerplexityPricingRecord } from "../../../types/pricing";
import { PerplexityPricingRecordSchema } from "../../schemas/pricing";
import { validatePricingSafe } from "../../utils/validate";

const PROVIDER = "Perplexity.ai";
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
  // Convert "Sonar" -> "sonar"
  // Convert "Sonar Pro" -> "sonar-pro"
  // Convert "Sonar Reasoning" -> "sonar-reasoning"
  // Convert "Sonar Reasoning Pro" -> "sonar-reasoning-pro"
  // Convert "Sonar Deep Research" -> "sonar-deep-research"

  return displayName
    .toLowerCase()
    .trim()
    .replace(/\*\*/g, "") // Remove markdown bold
    .replace(/\s+/g, "-");
};

export const parsePerplexityMarkdown = (
  markdown: string
): PerplexityPricingRecord => {
  const lines = markdown.split("\n");
  const models: PerplexityPricingRecord = {};

  // Find the table with model pricing
  // It starts with "| Model | Input Tokens ($/1M) | Output Tokens ($/1M) ..."
  let tableStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].includes("| Model |") &&
      lines[i].includes("Input Tokens") &&
      lines[i].includes("Output Tokens")
    ) {
      tableStartIndex = i;
      break;
    }
  }

  if (tableStartIndex === -1) {
    throw new Error("Could not find pricing table in markdown");
  }

  // Parse table header to find column indices
  const headerLine = lines[tableStartIndex];
  const headers = headerLine
    .split("|")
    .map((h) => h.trim())
    .filter((h) => h);

  const modelColIndex = headers.findIndex((h) => h === "Model");
  const inputColIndex = headers.findIndex((h) =>
    h.includes("Input Tokens")
  );
  const outputColIndex = headers.findIndex((h) =>
    h.includes("Output Tokens")
  );
  const citationColIndex = headers.findIndex((h) =>
    h.includes("Citation Tokens")
  );
  const searchColIndex = headers.findIndex((h) =>
    h.includes("Search Queries")
  );
  const reasoningColIndex = headers.findIndex((h) =>
    h.includes("Reasoning Tokens")
  );

  // Skip the header line and separator line
  for (let i = tableStartIndex + 2; i < lines.length; i++) {
    const line = lines[i].trim();

    // Stop if we hit an empty line or a non-table line
    if (!line || !line.startsWith("|")) {
      break;
    }

    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c);

    if (cells.length < 3) continue; // Need at least model, input, output

    const modelDisplay = cells[modelColIndex];
    if (!modelDisplay || modelDisplay === "Model") continue;

    const modelKey = normalizeModelName(modelDisplay);

    const input = parseCurrency(cells[inputColIndex]);
    const output = parseCurrency(cells[outputColIndex]);

    if (input === undefined || output === undefined) continue;

    // Use type assertion to match runtime JSON structure (not TypeScript type)
    models[modelKey] = {
      provider: PROVIDER,
      category: CATEGORY,
      input,
      output,
    } as any;

    // Add optional fields if present
    if (citationColIndex !== -1 && cells[citationColIndex]) {
      const citation = parseCurrency(cells[citationColIndex]);
      if (citation !== undefined) {
        // Store citation price as cachedInput for now (we don't have a dedicated field)
        (models[modelKey] as any).cachedInput = citation;
      }
    }

    if (searchColIndex !== -1 && cells[searchColIndex]) {
      const searchPrice = parseCurrency(cells[searchColIndex]);
      if (searchPrice !== undefined) {
        // Search queries are priced per 1K, but we store per 1M for consistency
        // Actually, searchPrice is per 1K queries, so we keep it as-is
        (models[modelKey] as any).searchPrice = searchPrice;
      }
    }

    if (reasoningColIndex !== -1 && cells[reasoningColIndex]) {
      const reasoning = parseCurrency(cells[reasoningColIndex]);
      if (reasoning !== undefined) {
        (models[modelKey] as any).reasoning = reasoning;
      }
    }
  }

  // If we didn't find any models, throw an error
  if (Object.keys(models).length === 0) {
    throw new Error(
      "Failed to parse any Perplexity models from pricing page"
    );
  }

  return validatePricingSafe(models, PerplexityPricingRecordSchema, "perplexity");
};

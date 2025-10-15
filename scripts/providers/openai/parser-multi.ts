import type {
  TextPricingRecord,
  DallePricingRecord,
  EmbeddingPricingRecord,
  AudioPricingRecord,
} from "../../../types/pricing";
import {
  TextPricingRecordSchema,
  DallePricingRecordSchema,
  EmbeddingPricingRecordSchema,
  AudioPricingRecordSchema,
} from "../../schemas/pricing";
import { validatePricingSafe } from "../../utils/validate";

const PROVIDER = "OpenAI";

const PLAN_PRIORITY: Record<string, number> = {
  Standard: 0,
  Flex: 1,
  Batch: 2,
  Priority: 3,
};

const parseCurrency = (value: string): number | undefined => {
  const cleaned = value.trim();
  if (!cleaned || cleaned === "-" || cleaned.toLowerCase() === "n/a") {
    return undefined;
  }

  const match = cleaned.replace(/[,]/g, "").match(/([0-9]*\.?[0-9]+)/);
  return match ? Number(match[1]) : undefined;
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

const collectTable = (lines: string[], startIndex: number): { rows: string[][]; nextIndex: number } => {
  const tableLines: string[] = [];
  let index = startIndex;

  while (index < lines.length) {
    const current = lines[index];
    if (!current.trim() || !current.trim().startsWith("|")) {
      break;
    }
    tableLines.push(current);
    index += 1;
  }

  const rows = tableLines.map(splitTableRow).filter((cells) => cells.length > 0);
  return { rows, nextIndex: index };
};

export const parseOpenAITextTokens = (markdown: string): TextPricingRecord => {
  const lines = markdown.split("\n");
  const models: TextPricingRecord = {};
  const planByModel: Record<string, number> = {};
  let category = "";
  let subheading: string | null = null;
  let inTextTokenSection = false;

  const upsertModel = (
    model: string,
    data: { input?: number; cachedInput?: number; output?: number },
    planLabel: string | null
  ) => {
    const planRank =
      planLabel && planLabel in PLAN_PRIORITY
        ? PLAN_PRIORITY[planLabel]
        : PLAN_PRIORITY.Standard + 10;
    const existingRank = planByModel[model];

    if (existingRank !== undefined && existingRank <= planRank) {
      return;
    }

    planByModel[model] = planRank;
    models[model] = {
      provider: PROVIDER,
      category: category || "Text tokens",
      input: data.input,
      cachedInput: data.cachedInput,
      output: data.output,
    };
  };

  const findNextDataLine = (start: number): string | null => {
    for (let idx = start; idx < lines.length; idx += 1) {
      const candidate = lines[idx].trim();
      if (!candidate) {
        continue;
      }
      return candidate;
    }
    return null;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    if (line.startsWith("### ")) {
      category = line.slice(4).trim();
      inTextTokenSection = category === "Text tokens";
      subheading = null;
      continue;
    }

    if (!inTextTokenSection) {
      continue;
    }

    const nextLine = lines[i + 1]?.trim() ?? "";
    if (!line.startsWith("|")) {
      const nextDataLine = nextLine && nextLine.startsWith("|")
        ? nextLine
        : findNextDataLine(i + 1);

      if (nextDataLine?.startsWith("|")) {
        subheading = line;
        continue;
      }
      continue;
    }

    if (line.startsWith("|")) {
      const { rows, nextIndex } = collectTable(lines, i);
      i = nextIndex - 1;
      if (rows.length < 3) {
        continue;
      }

      const header = rows[0].map((cell) => cell.toLowerCase());
      const modelIndex = header.indexOf("model");
      const inputIndex = header.findIndex((cell) => cell.includes("input"));
      const cachedIndex = header.findIndex((cell) => cell.includes("cached"));
      const outputIndex = header.findIndex((cell) => cell.includes("output"));

      if (modelIndex === -1 || inputIndex === -1 || outputIndex === -1) {
        continue;
      }

      for (let rowIdx = 2; rowIdx < rows.length; rowIdx += 1) {
        const row = rows[rowIdx];
        const modelName = row[modelIndex];
        if (!modelName) {
          continue;
        }

        const input = parseCurrency(row[inputIndex] ?? "");
        const cachedInput = cachedIndex !== -1 ? parseCurrency(row[cachedIndex] ?? "") : undefined;
        const output = parseCurrency(row[outputIndex] ?? "");

        upsertModel(modelName, { input, cachedInput, output }, subheading);
      }
    }
  }

  if (Object.keys(models).length === 0) {
    throw new Error("Failed to parse OpenAI text token pricing from documentation");
  }

  return validatePricingSafe(models, TextPricingRecordSchema, "openai");
};

export const parseOpenAIImageGeneration = (markdown: string): DallePricingRecord => {
  const lines = markdown.split("\n");
  const models: DallePricingRecord = {};
  let inImageSection = false;
  let currentModel: string | null = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }

    if (line.startsWith("### ")) {
      const section = line.slice(4).trim();
      inImageSection = section === "Image generation";
      continue;
    }

    if (!inImageSection) {
      continue;
    }

    if (!line.startsWith("|")) {
      continue;
    }

    const { rows, nextIndex } = collectTable(lines, i);
    i = nextIndex - 1;

    if (rows.length < 3) {
      continue;
    }

    const header = rows[0];

    // Find size columns in header
    const sizeColumns: { index: number; size: string }[] = [];
    for (let colIdx = 0; colIdx < header.length; colIdx++) {
      const col = header[colIdx].trim();
      if (col.match(/\d+\s*x\s*\d+/)) {
        const normalized = col.replace(/\s*x\s*/g, "x");
        sizeColumns.push({ index: colIdx, size: normalized });
      }
    }

    if (sizeColumns.length === 0) {
      continue;
    }

    // Process each data row
    for (let rowIdx = 2; rowIdx < rows.length; rowIdx += 1) {
      const row = rows[rowIdx];

      // Skip empty rows
      if (row.length === 0 || (row.length === 1 && !row[0])) {
        continue;
      }

      // Detect if this row has a model name or just quality
      // If first cell is a quality keyword or starts with $, it's a quality-only row
      const firstCell = row[0]?.trim() || "";
      const isQualityOnlyRow = ["low", "medium", "high", "standard", "hd"].includes(firstCell.toLowerCase()) ||
                                firstCell.startsWith("$");

      if (isQualityOnlyRow) {
        // Quality-only row: [Quality, Price1, Price2, ...]
        if (!currentModel) continue;

        const quality = firstCell.toLowerCase();
        const priceStartIndex = 1;

        // Extract prices for each size
        for (let sizeIdx = 0; sizeIdx < sizeColumns.length; sizeIdx++) {
          const priceStr = row[priceStartIndex + sizeIdx];
          if (!priceStr) continue;

          const price = parseCurrency(priceStr);
          if (price === undefined) continue;

          // Create key for this size+quality combination
          const size = sizeColumns[sizeIdx].size;
          const key = quality !== "standard" ? `${size}-${quality}` : size;

          if (!models[currentModel]) {
            models[currentModel] = {};
          }

          models[currentModel][key] = {
            price,
            category: "Image Generation",
            provider: PROVIDER,
            unit: "per image",
          };
        }
      } else if (firstCell && firstCell.toLowerCase() !== "model") {
        // Model row: [Model, Quality, Price1, Price2, ...]
        currentModel = firstCell
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/·/g, "-");

        const quality = (row[1]?.trim() || "standard").toLowerCase();
        const priceStartIndex = 2;

        // Extract prices for each size
        for (let sizeIdx = 0; sizeIdx < sizeColumns.length; sizeIdx++) {
          const priceStr = row[priceStartIndex + sizeIdx];
          if (!priceStr) continue;

          const price = parseCurrency(priceStr);
          if (price === undefined) continue;

          // Create key for this size+quality combination
          const size = sizeColumns[sizeIdx].size;
          const key = quality !== "standard" ? `${size}-${quality}` : size;

          if (!models[currentModel]) {
            models[currentModel] = {};
          }

          models[currentModel][key] = {
            price,
            category: "Image Generation",
            provider: PROVIDER,
            unit: "per image",
          };
        }
      }
    }
  }

  if (Object.keys(models).length === 0) {
    throw new Error("Failed to parse OpenAI image generation pricing from documentation");
  }

  return validatePricingSafe(models, DallePricingRecordSchema, "dalle");
};

export const parseOpenAIEmbeddings = (markdown: string): EmbeddingPricingRecord => {
  const lines = markdown.split("\n");
  const models: EmbeddingPricingRecord = {};
  let inEmbeddingSection = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }

    if (line.startsWith("### ")) {
      const section = line.slice(4).trim();
      inEmbeddingSection = section === "Embeddings";
      continue;
    }

    if (!inEmbeddingSection) {
      continue;
    }

    if (!line.startsWith("|")) {
      continue;
    }

    const { rows, nextIndex } = collectTable(lines, i);
    i = nextIndex - 1;

    if (rows.length < 3) {
      continue;
    }

    const header = rows[0].map((h) => h.toLowerCase());
    const modelIndex = header.indexOf("model");
    const costIndex = header.findIndex((h) => h.includes("cost") && !h.includes("batch"));

    if (modelIndex === -1 || costIndex === -1) {
      continue;
    }

    for (let rowIdx = 2; rowIdx < rows.length; rowIdx += 1) {
      const row = rows[rowIdx];
      const modelName = row[modelIndex]?.trim();
      if (!modelName) {
        continue;
      }

      const price = parseCurrency(row[costIndex] ?? "");
      if (price === undefined) {
        continue;
      }

      models[modelName] = {
        price,
        context: "8K tokens", // Default context window
        category: "Embedding",
        provider: PROVIDER,
        unit: "per 1M tokens",
      };
    }
  }

  if (Object.keys(models).length === 0) {
    throw new Error("Failed to parse OpenAI embeddings pricing from documentation");
  }

  return validatePricingSafe(models, EmbeddingPricingRecordSchema, "embedding");
};

export const parseOpenAIAudio = (markdown: string): AudioPricingRecord => {
  const lines = markdown.split("\n");
  const models: AudioPricingRecord = {};
  let inTranscriptionSection = false;
  let inOtherModels = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }

    if (line.startsWith("### ")) {
      const section = line.slice(4).trim();
      inTranscriptionSection = section === "Transcription and speech generation";
      inOtherModels = false;
      continue;
    }

    if (line.startsWith("#### ")) {
      const subsection = line.slice(5).trim();
      inOtherModels = subsection === "Other models";
      continue;
    }

    if (!inTranscriptionSection || !inOtherModels) {
      continue;
    }

    if (!line.startsWith("|")) {
      continue;
    }

    const { rows, nextIndex } = collectTable(lines, i);
    i = nextIndex - 1;

    if (rows.length < 3) {
      continue;
    }

    const header = rows[0].map((h) => h.toLowerCase());
    const modelIndex = header.indexOf("model");
    const useCaseIndex = header.findIndex((h) => h.includes("use case"));
    const costIndex = header.indexOf("cost");

    if (modelIndex === -1 || costIndex === -1) {
      continue;
    }

    for (let rowIdx = 2; rowIdx < rows.length; rowIdx += 1) {
      const row = rows[rowIdx];
      const modelName = row[modelIndex]?.trim();
      if (!modelName) {
        continue;
      }

      const costStr = row[costIndex]?.trim();
      if (!costStr) {
        continue;
      }

      // Parse the cost string (e.g., "$0.006 / minute" or "$15.00 / 1M characters")
      const priceMatch = costStr.match(/\$([0-9.]+)\s*\/\s*(.+)/);
      if (!priceMatch) {
        continue;
      }

      const price = Number(priceMatch[1]);
      const unitStr = priceMatch[2].trim();

      // Normalize unit
      let unit = unitStr;
      if (unitStr.includes("1M characters")) {
        unit = "per 1M characters";
      } else if (unitStr === "minute") {
        unit = "per minute";
      }

      // Determine category from use case or model name
      let category = "Audio";
      if (useCaseIndex !== -1) {
        const useCase = row[useCaseIndex]?.toLowerCase() || "";
        if (useCase.includes("transcription")) {
          category = "Audio Transcription";
        } else if (useCase.includes("speech")) {
          category = "Text to Speech";
        }
      } else if (modelName.toLowerCase().includes("whisper")) {
        category = "Audio Transcription";
      } else if (modelName.toLowerCase().includes("tts")) {
        category = "Text to Speech";
      }

      // Normalize model name
      const normalizedModel = modelName.toLowerCase().replace(/\s+/g, "-");

      models[normalizedModel] = {
        price,
        unit,
        category,
        provider: PROVIDER,
      };
    }
  }

  if (Object.keys(models).length === 0) {
    throw new Error("Failed to parse OpenAI audio pricing from documentation");
  }

  return validatePricingSafe(models, AudioPricingRecordSchema, "audio");
};

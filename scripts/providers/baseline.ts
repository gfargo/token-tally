import { readFile } from "fs/promises";
import path from "path";

import type { ProviderKey, ProviderPayloads } from "../types";

let cachedProviders: ProviderPayloads | null = null;

const createEmptyProviders = (): ProviderPayloads => ({
  openai: {},
  anthropic: {},
  gemini: {},
  dalle: {},
  embedding: {},
  audio: {},
  cohere: {},
  perplexity: {},
  imagen: {},
});

const resolveGeneratedPath = () =>
  path.resolve(process.cwd(), "generated", "pricing.json");

export const loadBaselineProviders = async (): Promise<ProviderPayloads> => {
  if (cachedProviders) {
    return cachedProviders;
  }

  try {
    const filePath = resolveGeneratedPath();
    const fileContents = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(fileContents) as {
      providers?: Partial<ProviderPayloads>;
    };

    if (parsed.providers) {
      cachedProviders = {
        ...createEmptyProviders(),
        ...parsed.providers,
      } as ProviderPayloads;
      return cachedProviders;
    }
  } catch (error: unknown) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      console.warn(
        "[pricing] Failed to read baseline pricing.json:",
        nodeError.message
      );
    }
  }

  cachedProviders = createEmptyProviders();
  return cachedProviders;
};

export const getBaselineProvider = async <Key extends ProviderKey>(
  key: Key
): Promise<ProviderPayloads[Key]> => {
  const providers = await loadBaselineProviders();
  return providers[key];
};

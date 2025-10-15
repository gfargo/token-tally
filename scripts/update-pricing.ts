#!/usr/bin/env tsx
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import {
  fetchAnthropic,
  fetchAudio,
  fetchCohere,
  fetchDalle,
  fetchEmbedding,
  fetchGemini,
  fetchImagen,
  fetchOpenAI,
  fetchPerplexity,
} from "./providers";
import type { ProviderPayloads } from "./types";

type ScriptOptions = {
  dryRun: boolean;
  skipHistory: boolean;
};

const parseArgs = (): ScriptOptions => {
  const args = new Set(process.argv.slice(2));
  return {
    dryRun: args.has("--dry-run"),
    skipHistory: args.has("--no-history"),
  };
};

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const OUTPUT_DIR = path.resolve(process.cwd(), "generated");
const HISTORY_DIR = path.join(OUTPUT_DIR, "history");
const PRICING_FILE = path.join(OUTPUT_DIR, "pricing.json");

type PricingPayload = {
  lastUpdated: string;
  providers: ProviderPayloads;
};

const loadExistingPayload = async (): Promise<PricingPayload | null> => {
  try {
    const contents = await readFile(PRICING_FILE, "utf-8");
    return JSON.parse(contents) as PricingPayload;
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      console.warn("[pricing] failed to read current pricing.json:", nodeError);
    }
    return null;
  }
};

const collectProviders = async (): Promise<ProviderPayloads> => {
  const [
    openai,
    anthropic,
    gemini,
    dalle,
    embedding,
    audio,
    cohere,
    perplexity,
    imagen,
  ] = await Promise.all([
    fetchOpenAI(),
    fetchAnthropic(),
    fetchGemini(),
    fetchDalle(),
    fetchEmbedding(),
    fetchAudio(),
    fetchCohere(),
    fetchPerplexity(),
    fetchImagen(),
  ]);

  return {
    openai,
    anthropic,
    gemini,
    dalle,
    embedding,
    audio,
    cohere,
    perplexity,
    imagen,
  };
};

const writeJson = async (filePath: string, data: unknown) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
};

type ProviderDiff = {
  provider: keyof ProviderPayloads;
  added: string[];
  removed: string[];
  changed: string[];
};

const isEqual = (a: unknown, b: unknown) =>
  JSON.stringify(a) === JSON.stringify(b);

const diffProviders = (
  previous: ProviderPayloads,
  next: ProviderPayloads
): ProviderDiff[] => {
  return (Object.keys(next) as Array<keyof ProviderPayloads>).map(
    (provider) => {
      const prevModels = previous[provider] ?? {};
      const nextModels = next[provider] ?? {};
      const added: string[] = [];
      const removed: string[] = [];
      const changed: string[] = [];

      for (const model of Object.keys(nextModels)) {
        if (!(model in prevModels)) {
          added.push(model);
        } else if (!isEqual(nextModels[model as keyof typeof nextModels], prevModels[model as keyof typeof prevModels])) {
          changed.push(model);
        }
      }

      for (const model of Object.keys(prevModels)) {
        if (!(model in nextModels)) {
          removed.push(model);
        }
      }

      return { provider, added, removed, changed };
    }
  );
};

const logDiffSummary = (
  previous: PricingPayload | null,
  nextPayload: PricingPayload
) => {
  if (!previous) {
    console.log("[pricing] no existing pricing.json found; treating as bootstrap");
    return;
  }

  if (previous.lastUpdated !== nextPayload.lastUpdated) {
    console.log(
      `[pricing] lastUpdated: ${previous.lastUpdated} → ${nextPayload.lastUpdated}`
    );
  }

  const diffs = diffProviders(previous.providers, nextPayload.providers);
  const rows = diffs
    .map((diff) => ({
      provider: diff.provider,
      added: diff.added.length,
      removed: diff.removed.length,
      changed: diff.changed.length,
    }))
    .filter((row) => row.added || row.removed || row.changed);

  if (rows.length === 0) {
    console.log("[pricing] no provider-level changes detected");
    return;
  }

  console.log("[pricing] provider change summary:");
  console.table(rows);
};

const main = async () => {
  const options = parseArgs();
  const now = new Date();
  const existingPayload = await loadExistingPayload();
  const providers = await collectProviders();

  const payload = {
    lastUpdated: formatDate(now),
    providers,
  };

  if (options.dryRun) {
    console.log(
      "[pricing] dry run: generated payload without writing to disk"
    );
    logDiffSummary(existingPayload, payload);
    return;
  }

  logDiffSummary(existingPayload, payload);
  await writeJson(PRICING_FILE, payload);
  console.log("[pricing] wrote latest pricing data to", PRICING_FILE);

  if (!options.skipHistory) {
    const historyFile = path.join(
      HISTORY_DIR,
      `${formatDate(now)}.json`
    );
    await writeJson(historyFile, payload);
    console.log("[pricing] archived snapshot at", historyFile);
  }
};

void main().catch((error) => {
  console.error("[pricing] update failed:", error);
  process.exit(1);
});

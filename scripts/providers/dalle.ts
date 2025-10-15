import { readFile } from "fs/promises";
import path from "path";

import type { DallePricingRecord } from "../types";
import { getBaselineProvider } from "./baseline";
import { parseOpenAIImageGeneration } from "./openai/parser-multi";

const OPENAI_PRICING_URL =
  process.env.OPENAI_PRICING_URL ??
  "https://r.jina.ai/https://platform.openai.com/docs/pricing";
const OPENAI_FIXTURE_PATH =
  process.env.OPENAI_PRICING_FIXTURE_PATH ??
  path.resolve(process.cwd(), "scripts/fixtures/openai/pricing.md");

const shouldForceFixture = () =>
  process.env.OPENAI_PRICING_FIXTURE === "1" ||
  process.env.NODE_ENV === "test";

const fetchRemoteMarkdown = async (): Promise<string | null> => {
  try {
    const response = await fetch(OPENAI_PRICING_URL, {
      headers: { "User-Agent": "TokenTally Pricing Bot/1.0" },
    });

    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn(
      `[pricing][dalle] remote fetch failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
    return null;
  }
};

const loadFixtureMarkdown = async (): Promise<string | null> => {
  try {
    return await readFile(OPENAI_FIXTURE_PATH, "utf-8");
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      console.warn(
        `[pricing][dalle] failed to read fixture: ${nodeError.message}`
      );
    }
    return null;
  }
};

export const fetchDalle = async (): Promise<DallePricingRecord> => {
  const baseline = await getBaselineProvider("dalle");
  const useFixtureOnly = shouldForceFixture();

  let markdown: string | null = null;
  let source: "remote" | "fixture" | null = null;

  if (!useFixtureOnly) {
    markdown = await fetchRemoteMarkdown();
    if (markdown && !markdown.includes("### Image generation")) {
      console.warn(
        "[pricing][dalle] remote response missing expected Image generation section; falling back to fixture"
      );
      markdown = null;
    }
    if (markdown) {
      source = "remote";
    }
  }

  if (!markdown) {
    markdown = await loadFixtureMarkdown();
    if (markdown) {
      source = "fixture";
    }
  }

  if (!markdown) {
    console.warn(
      "[pricing][dalle] falling back to baseline pricing due to missing markdown source"
    );
    return baseline;
  }

  try {
    const parsed = parseOpenAIImageGeneration(markdown);
    return Object.keys(parsed).length ? parsed : baseline;
  } catch (error) {
    console.warn(
      `[pricing][dalle] parse failure from ${
        source ?? "unknown"
      } source: ${error instanceof Error ? error.message : "unknown error"}`
    );

    if (source === "remote") {
      try {
        const fixtureMarkdown = await loadFixtureMarkdown();
        if (fixtureMarkdown) {
          const parsed = parseOpenAIImageGeneration(fixtureMarkdown);
          return Object.keys(parsed).length ? parsed : baseline;
        }
      } catch (fixtureError) {
        console.warn(
          `[pricing][dalle] fixture parse failure after remote error: ${
            fixtureError instanceof Error
              ? fixtureError.message
              : "unknown error"
          }`
        );
      }
    }

    console.warn("[pricing][dalle] falling back to baseline pricing data");
    return baseline;
  }
};

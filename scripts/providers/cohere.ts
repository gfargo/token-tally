import { readFile } from "fs/promises";
import path from "path";

import type { TextPricingRecord } from "../types";
import { getBaselineProvider } from "./baseline";
import { parseCohereMarkdown } from "./cohere/parser";

const COHERE_PRICING_URL =
  process.env.COHERE_PRICING_URL ??
  "https://r.jina.ai/https://cohere.com/pricing";
const COHERE_FIXTURE_PATH =
  process.env.COHERE_PRICING_FIXTURE_PATH ??
  path.resolve(
    process.cwd(),
    "scripts/fixtures/cohere/pricing.md"
  );

const shouldForceFixture = () =>
  process.env.COHERE_PRICING_FIXTURE === "1" ||
  process.env.NODE_ENV === "test";

const fetchRemoteMarkdown = async (): Promise<string | null> => {
  try {
    const response = await fetch(COHERE_PRICING_URL, {
      headers: { "User-Agent": "TokenTally Pricing Bot/1.0" },
    });

    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn(
      `[pricing][cohere] remote fetch failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
    return null;
  }
};

const loadFixtureMarkdown = async (): Promise<string | null> => {
  try {
    return await readFile(COHERE_FIXTURE_PATH, "utf-8");
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      console.warn(
        `[pricing][cohere] failed to read fixture: ${nodeError.message}`
      );
    }
    return null;
  }
};

export const fetchCohere = async (): Promise<TextPricingRecord> => {
  const baseline = await getBaselineProvider("cohere");
  const useFixtureOnly = shouldForceFixture();

  let markdown: string | null = null;
  let source: "remote" | "fixture" | null = null;

  if (!useFixtureOnly) {
    markdown = await fetchRemoteMarkdown();
    if (markdown && !markdown.includes("Pricing")) {
      console.warn(
        "[pricing][cohere] remote response missing expected pricing content; falling back to fixture"
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
      "[pricing][cohere] falling back to baseline pricing due to missing markdown source"
    );
    return baseline;
  }

  try {
    const parsed = parseCohereMarkdown(markdown);
    return Object.keys(parsed).length ? parsed : baseline;
  } catch (error) {
    console.warn(
      `[pricing][cohere] parse failure from ${
        source ?? "unknown"
      } source: ${error instanceof Error ? error.message : "unknown error"}`
    );

    if (source === "remote") {
      try {
        const fixtureMarkdown = await loadFixtureMarkdown();
        if (fixtureMarkdown) {
          const parsed = parseCohereMarkdown(fixtureMarkdown);
          return Object.keys(parsed).length ? parsed : baseline;
        }
      } catch (fixtureError) {
        console.warn(
          `[pricing][cohere] fixture parse failure after remote error: ${
            fixtureError instanceof Error
              ? fixtureError.message
              : "unknown error"
          }`
        );
      }
    }

    console.warn("[pricing][cohere] falling back to baseline pricing data");
    return baseline;
  }
};

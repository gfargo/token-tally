import { readFile } from "fs/promises";
import path from "path";

import type { TextPricingRecord } from "../types";
import { getBaselineProvider } from "./baseline";
import { parseAnthropicMarkdown } from "./anthropic/parser";

const ANTHROPIC_DOCS_URL =
  process.env.ANTHROPIC_DOCS_URL ??
  "https://r.jina.ai/https://docs.claude.com/en/docs/about-claude/models";
const ANTHROPIC_FIXTURE_PATH =
  process.env.ANTHROPIC_PRICING_FIXTURE_PATH ??
  path.resolve(
    process.cwd(),
    "scripts/fixtures/anthropic/docs-models.md"
  );

const shouldForceFixture = () =>
  process.env.ANTHROPIC_PRICING_FIXTURE === "1" ||
  process.env.NODE_ENV === "test";

const fetchRemoteMarkdown = async (): Promise<string | null> => {
  try {
    const response = await fetch(ANTHROPIC_DOCS_URL, {
      headers: { "User-Agent": "TokenTally Pricing Bot/1.0" },
    });

    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn(
      `[pricing][anthropic] remote fetch failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
    return null;
  }
};

const loadFixtureMarkdown = async (): Promise<string | null> => {
  try {
    return await readFile(ANTHROPIC_FIXTURE_PATH, "utf-8");
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      console.warn(
        `[pricing][anthropic] failed to read fixture: ${nodeError.message}`
      );
    }
    return null;
  }
};

export const fetchAnthropic = async (): Promise<TextPricingRecord> => {
  const baseline = await getBaselineProvider("anthropic");
  const useFixtureOnly = shouldForceFixture();

  let markdown: string | null = null;
  let source: "remote" | "fixture" | null = null;

  if (!useFixtureOnly) {
    markdown = await fetchRemoteMarkdown();
    if (markdown && !markdown.includes("Model pricing")) {
      console.warn(
        "[pricing][anthropic] remote response missing expected pricing section; falling back to fixture"
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
      "[pricing][anthropic] falling back to baseline pricing due to missing markdown source"
    );
    return baseline;
  }

  try {
    const parsed = parseAnthropicMarkdown(markdown);
    return Object.keys(parsed).length ? parsed : baseline;
  } catch (error) {
    console.warn(
      `[pricing][anthropic] parse failure from ${
        source ?? "unknown"
      } source: ${error instanceof Error ? error.message : "unknown error"}`
    );

    if (source === "remote") {
      try {
        const fixtureMarkdown = await loadFixtureMarkdown();
        if (fixtureMarkdown) {
          const parsed = parseAnthropicMarkdown(fixtureMarkdown);
          return Object.keys(parsed).length ? parsed : baseline;
        }
      } catch (fixtureError) {
        console.warn(
          `[pricing][anthropic] fixture parse failure after remote error: ${
            fixtureError instanceof Error
              ? fixtureError.message
              : "unknown error"
          }`
        );
      }
    }

    console.warn("[pricing][anthropic] falling back to baseline pricing data");
    return baseline;
  }
};

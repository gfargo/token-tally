import { readFile } from "fs/promises";
import path from "path";

import type { ImagenPricingRecord } from "../types";
import { getBaselineProvider } from "./baseline";
import { parseImagenMarkdown } from "./imagen/parser";

const GEMINI_PRICING_URL =
  process.env.GEMINI_PRICING_URL ??
  "https://r.jina.ai/https://ai.google.dev/pricing";
const GEMINI_FIXTURE_PATH =
  process.env.GEMINI_PRICING_FIXTURE_PATH ??
  path.resolve(process.cwd(), "scripts/fixtures/gemini/pricing.md");

const shouldForceFixture = () =>
  process.env.GEMINI_PRICING_FIXTURE === "1" ||
  process.env.NODE_ENV === "test";

const fetchRemoteMarkdown = async (): Promise<string | null> => {
  try {
    const response = await fetch(GEMINI_PRICING_URL, {
      headers: { "User-Agent": "TokenTally Pricing Bot/1.0" },
    });

    if (!response.ok) {
      throw new Error(`status ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.warn(
      `[pricing][imagen] remote fetch failed: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
    return null;
  }
};

const loadFixtureMarkdown = async (): Promise<string | null> => {
  try {
    return await readFile(GEMINI_FIXTURE_PATH, "utf-8");
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== "ENOENT") {
      console.warn(
        `[pricing][imagen] failed to read fixture: ${nodeError.message}`
      );
    }
    return null;
  }
};

export const fetchImagen = async (): Promise<ImagenPricingRecord> => {
  const baseline = await getBaselineProvider("imagen");
  const useFixtureOnly = shouldForceFixture();

  let markdown: string | null = null;
  let source: "remote" | "fixture" | null = null;

  if (!useFixtureOnly) {
    markdown = await fetchRemoteMarkdown();
    if (markdown && !markdown.toLowerCase().includes("imagen")) {
      console.warn(
        "[pricing][imagen] remote response missing expected Imagen content; falling back to fixture"
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
      "[pricing][imagen] falling back to baseline pricing due to missing markdown source"
    );
    return baseline;
  }

  try {
    const parsed = parseImagenMarkdown(markdown);
    return Object.keys(parsed).length ? parsed : baseline;
  } catch (error) {
    console.warn(
      `[pricing][imagen] parse failure from ${
        source ?? "unknown"
      } source: ${error instanceof Error ? error.message : "unknown error"}`
    );

    if (source === "remote") {
      try {
        const fixtureMarkdown = await loadFixtureMarkdown();
        if (fixtureMarkdown) {
          const parsed = parseImagenMarkdown(fixtureMarkdown);
          return Object.keys(parsed).length ? parsed : baseline;
        }
      } catch (fixtureError) {
        console.warn(
          `[pricing][imagen] fixture parse failure after remote error: ${
            fixtureError instanceof Error
              ? fixtureError.message
              : "unknown error"
          }`
        );
      }
    }

    console.warn("[pricing][imagen] falling back to baseline pricing data");
    return baseline;
  }
};

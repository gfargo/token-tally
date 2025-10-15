import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import path from "path";

import { parseGeminiMarkdown } from "../providers/gemini/parser";

const fixturePath = path.resolve(
  process.cwd(),
  "scripts/fixtures/gemini/pricing.md"
);

const main = async () => {
  const markdown = await readFile(fixturePath, "utf-8");
  const parsed = parseGeminiMarkdown(markdown);

  // Test Gemini 2.5 Pro - tiered pricing
  assert.ok(
    parsed["gemini-2.5-pro"],
    "gemini-2.5-pro should exist"
  );
  assert.equal(
    typeof parsed["gemini-2.5-pro"]?.input,
    "object",
    "gemini-2.5-pro input should be tiered (object)"
  );
  if (typeof parsed["gemini-2.5-pro"]?.input === "object" && "small" in parsed["gemini-2.5-pro"].input) {
    assert.equal(
      parsed["gemini-2.5-pro"].input.small,
      1.25,
      "gemini-2.5-pro input small tier mismatch"
    );
    assert.equal(
      parsed["gemini-2.5-pro"].input.large,
      2.5,
      "gemini-2.5-pro input large tier mismatch"
    );
  }
  if (typeof parsed["gemini-2.5-pro"]?.output === "object" && "small" in parsed["gemini-2.5-pro"].output) {
    assert.equal(
      parsed["gemini-2.5-pro"].output.small,
      10,
      "gemini-2.5-pro output small tier mismatch"
    );
    assert.equal(
      parsed["gemini-2.5-pro"].output.large,
      15,
      "gemini-2.5-pro output large tier mismatch"
    );
  }

  // Test context caching for gemini-2.5-pro
  assert.ok(
    parsed["gemini-2.5-pro"]?.contextCaching,
    "gemini-2.5-pro should have context caching"
  );
  if (parsed["gemini-2.5-pro"]?.contextCaching) {
    const caching = parsed["gemini-2.5-pro"].contextCaching;
    assert.equal(
      typeof caching.price,
      "object",
      "gemini-2.5-pro context caching should be tiered"
    );
    if (typeof caching.price === "object" && "small" in caching.price) {
      assert.equal(
        caching.price.small,
        0.125,
        "gemini-2.5-pro caching small tier mismatch"
      );
      assert.equal(
        caching.price.large,
        0.25,
        "gemini-2.5-pro caching large tier mismatch"
      );
    }
    assert.equal(
      caching.storage,
      4.5,
      "gemini-2.5-pro caching storage mismatch"
    );
  }

  // Test grounding search
  assert.ok(
    parsed["gemini-2.5-pro"]?.groundingSearch,
    "gemini-2.5-pro should have grounding search"
  );
  if (parsed["gemini-2.5-pro"]?.groundingSearch) {
    assert.equal(
      parsed["gemini-2.5-pro"].groundingSearch.freeRequests,
      1500,
      "gemini-2.5-pro grounding free requests mismatch"
    );
    assert.equal(
      parsed["gemini-2.5-pro"].groundingSearch.price,
      35,
      "gemini-2.5-pro grounding price mismatch"
    );
  }

  // Test Gemini 2.5 Flash - multi-modal pricing
  assert.ok(
    parsed["gemini-2.5-flash"],
    "gemini-2.5-flash should exist"
  );
  assert.equal(
    typeof parsed["gemini-2.5-flash"]?.input,
    "object",
    "gemini-2.5-flash input should be multi-modal (object)"
  );
  if (typeof parsed["gemini-2.5-flash"]?.input === "object" && "text" in parsed["gemini-2.5-flash"].input) {
    assert.equal(
      parsed["gemini-2.5-flash"].input.text,
      0.3,
      "gemini-2.5-flash input text mismatch"
    );
    assert.equal(
      parsed["gemini-2.5-flash"].input.audio,
      1.0,
      "gemini-2.5-flash input audio mismatch"
    );
  }
  assert.equal(
    typeof parsed["gemini-2.5-flash"]?.output,
    "number",
    "gemini-2.5-flash output should be a simple number"
  );
  assert.equal(
    parsed["gemini-2.5-flash"]?.output,
    2.5,
    "gemini-2.5-flash output mismatch"
  );

  // Test simple context caching for flash
  if (parsed["gemini-2.5-flash"]?.contextCaching) {
    const caching = parsed["gemini-2.5-flash"].contextCaching;
    assert.equal(
      typeof caching.price,
      "number",
      "gemini-2.5-flash context caching should be simple number"
    );
    assert.equal(
      caching.price,
      0.03,
      "gemini-2.5-flash caching price mismatch"
    );
    assert.equal(
      caching.storage,
      1,
      "gemini-2.5-flash caching storage mismatch"
    );
  }

  // Test Gemini 2.0 Flash - balanced model
  assert.ok(
    parsed["gemini-2.0-flash"],
    "gemini-2.0-flash should exist"
  );

  // Test Flash Lite models
  assert.ok(
    parsed["gemini-2.5-flash-lite"] || parsed["gemini-1.5-flash-8b"],
    "at least one flash-lite model should exist"
  );

  // Verify all models have required fields
  for (const [modelName, pricing] of Object.entries(parsed)) {
    assert.equal(
      pricing.provider,
      "Google",
      `${modelName} provider mismatch`
    );
    assert.equal(
      pricing.category,
      "Text Generation",
      `${modelName} category mismatch`
    );
    assert.equal(
      pricing.contextWindow,
      1000000,
      `${modelName} context window mismatch`
    );
    assert.ok(
      pricing.input !== undefined,
      `${modelName} input should be defined`
    );
    assert.ok(
      pricing.output !== undefined,
      `${modelName} output should be defined`
    );
  }

  assert.ok(
    Object.keys(parsed).length >= 5,
    `expected at least 5 models, got ${Object.keys(parsed).length}`
  );

  console.log("[pricing:test] Gemini parser matched expected baseline");
  console.log(`[pricing:test] Parsed ${Object.keys(parsed).length} models:`, Object.keys(parsed).join(", "));
};

void main().catch((error) => {
  console.error("[pricing:test] Gemini parser failed:", error);
  process.exit(1);
});

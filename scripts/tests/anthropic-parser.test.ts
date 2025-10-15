import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import path from "path";

import { parseAnthropicMarkdown } from "../providers/anthropic/parser";

const fixturePath = path.resolve(
  process.cwd(),
  "scripts/fixtures/anthropic/docs-models.md"
);

const main = async () => {
  const markdown = await readFile(fixturePath, "utf-8");
  const parsed = parseAnthropicMarkdown(markdown);

  // Test Opus 4.1 pricing
  assert.ok(
    parsed["claude-opus-4-1"],
    "claude-opus-4-1 should exist"
  );
  assert.equal(
    parsed["claude-opus-4-1"]?.input,
    15,
    "claude-opus-4-1 input mismatch"
  );
  assert.equal(
    parsed["claude-opus-4-1"]?.output,
    75,
    "claude-opus-4-1 output mismatch"
  );
  assert.equal(
    parsed["claude-opus-4-1"]?.promptCachingWrite,
    18.75,
    "claude-opus-4-1 cache write mismatch"
  );
  assert.equal(
    parsed["claude-opus-4-1"]?.promptCachingRead,
    1.5,
    "claude-opus-4-1 cache read mismatch"
  );

  // Test Sonnet 3.7 pricing
  assert.ok(
    parsed["claude-3-7-sonnet"],
    "claude-3-7-sonnet should exist"
  );
  assert.equal(
    parsed["claude-3-7-sonnet"]?.input,
    3,
    "claude-3-7-sonnet input mismatch"
  );
  assert.equal(
    parsed["claude-3-7-sonnet"]?.output,
    15,
    "claude-3-7-sonnet output mismatch"
  );
  assert.equal(
    parsed["claude-3-7-sonnet"]?.promptCachingWrite,
    3.75,
    "claude-3-7-sonnet cache write mismatch"
  );
  assert.equal(
    parsed["claude-3-7-sonnet"]?.promptCachingRead,
    0.3,
    "claude-3-7-sonnet cache read mismatch"
  );

  // Test Haiku 3.5 pricing
  assert.ok(
    parsed["claude-3-5-haiku"],
    "claude-3-5-haiku should exist"
  );
  assert.equal(
    parsed["claude-3-5-haiku"]?.input,
    0.8,
    "claude-3-5-haiku input mismatch"
  );
  assert.equal(
    parsed["claude-3-5-haiku"]?.output,
    4,
    "claude-3-5-haiku output mismatch"
  );
  assert.equal(
    parsed["claude-3-5-haiku"]?.promptCachingWrite,
    1,
    "claude-3-5-haiku cache write mismatch"
  );
  assert.equal(
    parsed["claude-3-5-haiku"]?.promptCachingRead,
    0.08,
    "claude-3-5-haiku cache read mismatch"
  );

  // Test that newer models exist
  assert.ok(
    parsed["claude-sonnet-4-5"],
    "claude-sonnet-4-5 should exist"
  );
  assert.ok(
    parsed["claude-opus-4"],
    "claude-opus-4 should exist"
  );

  // Verify all models have required fields
  for (const [modelName, pricing] of Object.entries(parsed)) {
    assert.equal(
      pricing.provider,
      "Anthropic",
      `${modelName} provider mismatch`
    );
    assert.equal(
      pricing.category,
      "Text Generation",
      `${modelName} category mismatch`
    );
    assert.equal(
      pricing.contextWindow,
      200000,
      `${modelName} context window mismatch`
    );
    assert.equal(
      pricing.batchProcessingDiscount,
      0.5,
      `${modelName} batch discount mismatch`
    );
    assert.ok(
      typeof pricing.input === "number",
      `${modelName} input should be a number`
    );
    assert.ok(
      typeof pricing.output === "number",
      `${modelName} output should be a number`
    );
  }

  assert.ok(
    Object.keys(parsed).length >= 7,
    `expected at least 7 models, got ${Object.keys(parsed).length}`
  );

  console.log("[pricing:test] Anthropic parser matched expected baseline");
  console.log(`[pricing:test] Parsed ${Object.keys(parsed).length} models:`, Object.keys(parsed).join(", "));
};

void main().catch((error) => {
  console.error("[pricing:test] Anthropic parser failed:", error);
  process.exit(1);
});

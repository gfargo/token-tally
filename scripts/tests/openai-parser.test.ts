import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import path from "path";

import { parseOpenAITextTokens } from "../providers/openai/parser-multi";

const fixturePath = path.resolve(
  process.cwd(),
  "scripts/fixtures/openai/pricing.md"
);

const main = async () => {
  const markdown = await readFile(fixturePath, "utf-8");
  const parsed = parseOpenAITextTokens(markdown);

  assert.equal(parsed["gpt-4o"]?.input, 2.5, "gpt-4o input mismatch");
  assert.equal(parsed["gpt-4o"]?.cachedInput, 1.25, "gpt-4o cached input mismatch");
  assert.equal(parsed["gpt-4o"]?.output, 10, "gpt-4o output mismatch");

  assert.equal(parsed["o1"]?.input, 15, "o1 input mismatch");
  assert.equal(parsed["o1"]?.cachedInput, 7.5, "o1 cached input mismatch");
  assert.equal(parsed["o1"]?.output, 60, "o1 output mismatch");

  assert.equal(parsed["gpt-4o-mini"]?.input, 0.15, "gpt-4o-mini input mismatch");
  assert.equal(parsed["gpt-4o-mini"]?.cachedInput, 0.075, "gpt-4o-mini cached input mismatch");
  assert.equal(parsed["gpt-4o-mini"]?.output, 0.6, "gpt-4o-mini output mismatch");

  assert.equal(parsed["o3"]?.input, 2, "o3 input mismatch");
  assert.equal(parsed["o3"]?.output, 8, "o3 output mismatch");

  assert.ok(Object.keys(parsed).length > 10, "expected multiple models from parser");

  console.log("[pricing:test] OpenAI parser matched expected baseline");
};

void main().catch((error) => {
  console.error("[pricing:test] OpenAI parser failed:", error);
  process.exit(1);
});

import { readFile } from "fs/promises";
import path from "path";
import assert from "assert";

import { parsePerplexityMarkdown } from "../providers/perplexity/parser";

const main = async () => {
  console.log("Running Perplexity parser tests...\n");

  // Load fixture
  const fixturePath = path.resolve(
    process.cwd(),
    "scripts/fixtures/perplexity/pricing.md"
  );
  const markdown = await readFile(fixturePath, "utf-8");

  // Parse the markdown
  const parsed = parsePerplexityMarkdown(markdown);

  console.log(`✓ Parser extracted ${Object.keys(parsed).length} models\n`);

  // Test: Sonar
  console.log("Testing: sonar");
  assert.ok(parsed["sonar"], "sonar model should exist");
  assert.equal(
    parsed["sonar"]?.provider,
    "Perplexity.ai",
    "sonar provider should be Perplexity.ai"
  );
  assert.equal(
    parsed["sonar"]?.category,
    "Text Generation",
    "sonar category should be Text Generation"
  );
  assert.equal(
    parsed["sonar"]?.input,
    1,
    "sonar input should be $1/1M tokens"
  );
  assert.equal(
    parsed["sonar"]?.output,
    1,
    "sonar output should be $1/1M tokens"
  );
  assert.equal(
    parsed["sonar"]?.reasoning,
    undefined,
    "sonar should not have reasoning pricing"
  );
  assert.equal(
    parsed["sonar"]?.searchPrice,
    undefined,
    "sonar should not have search pricing"
  );
  console.log("✓ sonar passed\n");

  // Test: Sonar Pro
  console.log("Testing: sonar-pro");
  assert.ok(parsed["sonar-pro"], "sonar-pro model should exist");
  assert.equal(
    parsed["sonar-pro"]?.input,
    3,
    "sonar-pro input should be $3/1M tokens"
  );
  assert.equal(
    parsed["sonar-pro"]?.output,
    15,
    "sonar-pro output should be $15/1M tokens"
  );
  console.log("✓ sonar-pro passed\n");

  // Test: Sonar Reasoning
  console.log("Testing: sonar-reasoning");
  assert.ok(parsed["sonar-reasoning"], "sonar-reasoning model should exist");
  assert.equal(
    parsed["sonar-reasoning"]?.input,
    1,
    "sonar-reasoning input should be $1/1M tokens"
  );
  assert.equal(
    parsed["sonar-reasoning"]?.output,
    5,
    "sonar-reasoning output should be $5/1M tokens"
  );
  console.log("✓ sonar-reasoning passed\n");

  // Test: Sonar Reasoning Pro
  console.log("Testing: sonar-reasoning-pro");
  assert.ok(
    parsed["sonar-reasoning-pro"],
    "sonar-reasoning-pro model should exist"
  );
  assert.equal(
    parsed["sonar-reasoning-pro"]?.input,
    2,
    "sonar-reasoning-pro input should be $2/1M tokens"
  );
  assert.equal(
    parsed["sonar-reasoning-pro"]?.output,
    8,
    "sonar-reasoning-pro output should be $8/1M tokens"
  );
  console.log("✓ sonar-reasoning-pro passed\n");

  // Test: Sonar Deep Research
  console.log("Testing: sonar-deep-research");
  assert.ok(
    parsed["sonar-deep-research"],
    "sonar-deep-research model should exist"
  );
  assert.equal(
    parsed["sonar-deep-research"]?.input,
    2,
    "sonar-deep-research input should be $2/1M tokens"
  );
  assert.equal(
    parsed["sonar-deep-research"]?.output,
    8,
    "sonar-deep-research output should be $8/1M tokens"
  );
  assert.equal(
    parsed["sonar-deep-research"]?.cachedInput,
    2,
    "sonar-deep-research citation tokens should be $2/1M tokens"
  );
  assert.equal(
    parsed["sonar-deep-research"]?.searchPrice,
    5,
    "sonar-deep-research search queries should be $5/1K queries"
  );
  assert.equal(
    parsed["sonar-deep-research"]?.reasoning,
    3,
    "sonar-deep-research reasoning tokens should be $3/1M tokens"
  );
  console.log("✓ sonar-deep-research passed\n");

  console.log("✅ All Perplexity parser tests passed!");
};

void main();

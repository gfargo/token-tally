import { readFile } from "fs/promises";
import path from "path";
import assert from "assert";

import { parseCohereMarkdown } from "../providers/cohere/parser";

const main = async () => {
  console.log("Running Cohere parser tests...\n");

  // Load fixture
  const fixturePath = path.resolve(
    process.cwd(),
    "scripts/fixtures/cohere/pricing.md"
  );
  const markdown = await readFile(fixturePath, "utf-8");

  // Parse the markdown
  const parsed = parseCohereMarkdown(markdown);

  console.log(`✓ Parser extracted ${Object.keys(parsed).length} models\n`);

  // Test: Command
  console.log("Testing: command");
  assert.ok(parsed["command"], "command model should exist");
  assert.equal(
    parsed["command"]?.provider,
    "Cohere",
    "command provider should be Cohere"
  );
  assert.equal(
    parsed["command"]?.category,
    "Text Generation",
    "command category should be Text Generation"
  );
  assert.equal(
    parsed["command"]?.input,
    1.0,
    "command input should be $1.00/1M tokens"
  );
  assert.equal(
    parsed["command"]?.output,
    2.0,
    "command output should be $2.00/1M tokens"
  );
  console.log("✓ command passed\n");

  // Test: Command-light
  console.log("Testing: command-light");
  assert.ok(parsed["command-light"], "command-light model should exist");
  assert.equal(
    parsed["command-light"]?.input,
    0.3,
    "command-light input should be $0.30/1M tokens"
  );
  assert.equal(
    parsed["command-light"]?.output,
    0.6,
    "command-light output should be $0.60/1M tokens"
  );
  console.log("✓ command-light passed\n");

  // Test: Command R
  console.log("Testing: command-r");
  assert.ok(parsed["command-r"], "command-r model should exist");
  assert.equal(
    parsed["command-r"]?.input,
    0.5,
    "command-r input should be $0.50/1M tokens"
  );
  assert.equal(
    parsed["command-r"]?.output,
    1.5,
    "command-r output should be $1.50/1M tokens"
  );
  console.log("✓ command-r passed\n");

  // Test: Command R+ (should use 08-2024 pricing, the latest)
  console.log("Testing: command-r-plus");
  assert.ok(parsed["command-r-plus"], "command-r-plus model should exist");
  assert.equal(
    parsed["command-r-plus"]?.input,
    2.5,
    "command-r-plus input should be $2.50/1M tokens (08-2024 version)"
  );
  assert.equal(
    parsed["command-r-plus"]?.output,
    10.0,
    "command-r-plus output should be $10.00/1M tokens (08-2024 version)"
  );
  console.log("✓ command-r-plus passed\n");

  // Test: Aya Expanse 8B
  console.log("Testing: aya-expanse-8b");
  assert.ok(parsed["aya-expanse-8b"], "aya-expanse-8b model should exist");
  assert.equal(
    parsed["aya-expanse-8b"]?.input,
    0.5,
    "aya-expanse-8b input should be $0.50/1M tokens"
  );
  assert.equal(
    parsed["aya-expanse-8b"]?.output,
    1.5,
    "aya-expanse-8b output should be $1.50/1M tokens"
  );
  console.log("✓ aya-expanse-8b passed\n");

  // Test: Aya Expanse 32B
  console.log("Testing: aya-expanse-32b");
  assert.ok(parsed["aya-expanse-32b"], "aya-expanse-32b model should exist");
  assert.equal(
    parsed["aya-expanse-32b"]?.input,
    0.5,
    "aya-expanse-32b input should be $0.50/1M tokens"
  );
  assert.equal(
    parsed["aya-expanse-32b"]?.output,
    1.5,
    "aya-expanse-32b output should be $1.50/1M tokens"
  );
  console.log("✓ aya-expanse-32b passed\n");

  console.log("✅ All Cohere parser tests passed!");
};

void main();

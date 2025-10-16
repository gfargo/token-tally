import { strict as assert } from "node:assert";

import { fetchAdditionalProviders } from "../providers/additional";

const EXPECTED_PROVIDERS = [
  "mistral",
  "groq",
  "meta-marketplaces",
  "xai-grok",
  "stability-ai",
  "midjourney",
  "openrouter",
];

const main = async () => {
  const catalog = await fetchAdditionalProviders();

  EXPECTED_PROVIDERS.forEach((provider) => {
    assert.ok(
      provider in catalog,
      `expected additional provider "${provider}" to be present`
    );
    const entry = catalog[provider];
    assert.ok(entry.models?.length, `provider "${provider}" missing models`);
    entry.models.forEach((model) => {
      assert.ok(model.id, `provider "${provider}" has model without id`);
      assert.ok(
        model.modes?.length,
        `provider "${provider}" model "${model.id}" missing modes`
      );
      model.modes.forEach((mode) => {
        assert.ok(
          ["token", "subscription", "credit", "compute", "range"].includes(
            mode.type
          ),
          `unexpected mode type "${mode.type}" for model "${model.id}"`
        );
      });
    });
  });

  console.log("[pricing:test] additional provider catalog looks healthy");
};

void main().catch((error) => {
  console.error("[pricing:test] additional provider catalog failed:", error);
  process.exit(1);
});

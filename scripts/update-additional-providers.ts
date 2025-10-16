#!/usr/bin/env tsx
import { readFile, writeFile } from "fs/promises";
import path from "path";

import { fetchAdditionalProviders } from "./providers/additional";

const PRICING_FILE = path.resolve(process.cwd(), "generated/pricing.json");

const main = async () => {
  const contents = await readFile(PRICING_FILE, "utf-8");
  const payload = JSON.parse(contents);
  payload.additionalProviders = await fetchAdditionalProviders();
  await writeFile(PRICING_FILE, JSON.stringify(payload, null, 2) + "\n", "utf-8");
  console.log("[pricing] additionalProviders section updated");
};

void main();

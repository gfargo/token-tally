import type { ImagenPricingRecord } from "../../../types/pricing";
import { ImagenPricingRecordSchema } from "../../schemas/pricing";
import { validatePricingSafe } from "../../utils/validate";

const parseCurrency = (value: string): number | undefined => {
  const cleaned = value.trim();
  if (!cleaned || cleaned === "-" || cleaned.toLowerCase() === "n/a" || cleaned.toLowerCase() === "not available") {
    return undefined;
  }

  const match = cleaned.replace(/[,]/g, "").match(/\$([0-9]*\.?[0-9]+)/);
  return match ? Number(match[1]) : undefined;
};

export const parseImagenMarkdown = (markdown: string): ImagenPricingRecord => {
  const lines = markdown.split("\n");
  const models: ImagenPricingRecord = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for Imagen pricing rows in tables
    // "| Imagen 4 Fast image price | Not available | $0.02 |"
    // "| Imagen 4 Standard image price | Not available | $0.04 |"
    // "| Image price | Not available | $0.03 |"

    if (line.startsWith("|") && (line.toLowerCase().includes("imagen") || line.toLowerCase().includes("image price"))) {
      const cells = line.split("|").map((c) => c.trim()).filter((c) => c);

      if (cells.length < 3) continue;

      const label = cells[0];
      const paidTierPrice = cells[2];

      const price = parseCurrency(paidTierPrice);
      if (price === undefined) continue;

      // Determine model name from label
      let modelName: string;
      if (label.includes("Imagen 4 Fast")) {
        modelName = "imagen-4-fast";
      } else if (label.includes("Imagen 4 Standard")) {
        modelName = "imagen-4";
      } else if (label.includes("Imagen 4 Ultra")) {
        modelName = "imagen-4-ultra";
      } else if (label === "Image price") {
        // This is the generic Imagen 3 pricing
        modelName = "imagen-3";
      } else {
        continue;
      }

      models[modelName] = {
        price,
        category: "Image Generation",
        provider: "Google",
        unit: "per image",
      };
    }
  }

  if (Object.keys(models).length === 0) {
    throw new Error("Failed to parse Imagen pricing from Google pricing page");
  }

  return validatePricingSafe(models, ImagenPricingRecordSchema, "imagen");
};

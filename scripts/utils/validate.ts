import { ZodSchema, ZodError } from "zod";

/**
 * Validates data against a Zod schema and provides detailed error messages
 * @param data - The data to validate
 * @param schema - The Zod schema to validate against
 * @param providerName - Name of the provider for error messages
 * @returns The validated data
 * @throws Error with detailed validation message if validation fails
 */
export function validatePricing<T>(
  data: unknown,
  schema: ZodSchema<T>,
  providerName: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues
        .map((issue) => {
          const path = issue.path.join(".");
          return `  - ${path || "root"}: ${issue.message}`;
        })
        .join("\n");

      throw new Error(
        `[${providerName}] Pricing validation failed:\n${issues}`
      );
    }
    throw error;
  }
}

/**
 * Safely validates data and logs warnings instead of throwing errors
 * Falls back to the provided data if validation fails
 * @param data - The data to validate
 * @param schema - The Zod schema to validate against
 * @param providerName - Name of the provider for logging
 * @returns The validated data, or original data if validation fails
 */
export function validatePricingSafe<T>(
  data: unknown,
  schema: ZodSchema<T>,
  providerName: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues
        .map((issue) => {
          const path = issue.path.join(".");
          return `${path || "root"}: ${issue.message}`;
        })
        .join("; ");

      console.warn(
        `[pricing][${providerName}] validation warning: ${issues}`
      );
    } else {
      console.warn(
        `[pricing][${providerName}] unexpected validation error:`,
        error
      );
    }
    // Return original data as fallback (unsafe, but prevents breaking)
    return data as T;
  }
}

/**
 * Validates a single model entry
 * @param modelName - The model name/key
 * @param modelData - The model pricing data
 * @param schema - The Zod schema for the model
 * @param providerName - Name of the provider for error messages
 * @returns The validated model data
 */
export function validateModel<T>(
  modelName: string,
  modelData: unknown,
  schema: ZodSchema<T>,
  providerName: string
): T {
  try {
    return schema.parse(modelData);
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues
        .map((issue) => {
          const path = issue.path.join(".");
          return `${path}: ${issue.message}`;
        })
        .join("; ");

      throw new Error(
        `[${providerName}] Model "${modelName}" validation failed: ${issues}`
      );
    }
    throw error;
  }
}

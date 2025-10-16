import type { AdditionalProviderPayloads } from "../types";

const STATIC_ADDITIONAL_PROVIDERS: AdditionalProviderPayloads = {
  mistral: {
    provider: "Mistral",
    catalogUrl: "https://docs.mistral.ai/platform/pricing/",
    models: [
      {
        id: "mistral-small",
        name: "Mistral Small",
        category: "Text tokens",
        provider: "Mistral",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 1,
            output: 3,
            description: "Usage-based API pricing",
          },
        ],
        url: "https://docs.mistral.ai/platform/pricing/",
        notes: "Pricing last verified 2024-08 from Mistral API docs.",
        tags: ["general"],
      },
      {
        id: "mistral-medium",
        name: "Mistral Medium",
        category: "Text tokens",
        provider: "Mistral",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 2.7,
            output: 8.1,
            description: "Balanced cost-performance tier",
          },
        ],
        url: "https://docs.mistral.ai/platform/pricing/",
        notes: "Pricing last verified 2024-08.",
        tags: ["general"],
      },
      {
        id: "mistral-large",
        name: "Mistral Large",
        category: "Text tokens",
        provider: "Mistral",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 8,
            output: 24,
            description: "Flagship reasoning-capable model",
          },
        ],
        url: "https://docs.mistral.ai/platform/pricing/",
        notes: "Pricing last verified 2024-08.",
        tags: ["reasoning"],
      },
      {
        id: "codestral",
        name: "Codestral",
        category: "Code generation",
        provider: "Mistral",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 1,
            output: 3,
            description: "Code-specialised usage pricing",
          },
        ],
        url: "https://docs.mistral.ai/platform/pricing/",
        notes: "Pricing last verified 2024-08.",
        tags: ["code"],
      },
    ],
  },
  groq: {
    provider: "Groq",
    catalogUrl: "https://console.groq.com/docs/pricing",
    models: [
      {
        id: "groq-llama3-8b",
        name: "Llama 3 8B (Groq)",
        category: "Text tokens",
        provider: "Groq",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 0.05,
            output: 0.08,
            description: "Ultra-low latency tier",
          },
        ],
        url: "https://console.groq.com/docs/pricing",
        notes:
          "Latency guarantees typically <200ms for 8B; pricing captured 2024-09.",
        tags: ["low-latency"],
      },
      {
        id: "groq-llama3-70b",
        name: "Llama 3 70B (Groq)",
        category: "Text tokens",
        provider: "Groq",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 0.59,
            output: 0.79,
            description: "High-accuracy, hardware-accelerated tier",
          },
          {
            type: "compute",
            unit: "perSecond",
            price: 0.000002,
            description: "Effective per-second compute with 500 tok/s target",
          },
        ],
        url: "https://console.groq.com/docs/pricing",
        notes: "Pricing captured 2024-09; compute estimate derived from Groq docs.",
        tags: ["latency-sla", "reasoning"],
      },
      {
        id: "groq-mixtral-8x7b",
        name: "Mixtral 8x7B (Groq)",
        category: "Text tokens",
        provider: "Groq",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 0.27,
            output: 0.40,
            description: "Mixture-of-experts with deterministic throughput",
          },
        ],
        url: "https://console.groq.com/docs/pricing",
        notes: "Pricing captured 2024-09.",
        tags: ["mixture-of-experts"],
      },
    ],
  },
  "meta-marketplaces": {
    provider: "Meta Llama (Third-Party)",
    catalogUrl: "https://llama.meta.com/",
    models: [
      {
        id: "fireworks-llama3-70b",
        name: "Llama 3 70B (Fireworks)",
        category: "Marketplace tokens",
        provider: "Meta Llama",
        vendor: "Fireworks AI",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 0.8,
            output: 0.8,
            description: "Serverless pricing via Fireworks workspace",
          },
        ],
        url: "https://fireworks.ai/pricing",
        notes:
          "Representative Fireworks pay-as-you-go pricing, 2024-09. Volume tiers available.",
        tags: ["marketplace"],
      },
      {
        id: "together-llama3-70b",
        name: "Llama 3 70B (Together AI)",
        category: "Marketplace tokens",
        provider: "Meta Llama",
        vendor: "Together AI",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 0.69,
            output: 0.99,
            description: "On-demand serverless",
          },
          {
            type: "compute",
            unit: "perHour",
            price: 3.9,
            description: "Dedicated GPU hourly rate via Together deployments",
          },
        ],
        url: "https://www.together.ai/pricing",
        notes: "Pricing captured 2024-09; dedicated rates vary by reservation length.",
        tags: ["marketplace", "dedicated"],
      },
      {
        id: "runpod-llama3-8b",
        name: "Llama 3 8B (RunPod)",
        category: "Marketplace tokens",
        provider: "Meta Llama",
        vendor: "RunPod",
        modes: [
          {
            type: "compute",
            unit: "perHour",
            price: 1.5,
            description: "A40 48GB dedicated pod hourly estimate",
          },
          {
            type: "range",
            unit: "per1Mtokens",
            min: 0.3,
            max: 0.5,
            description: "Effective per-token cost based on typical throughput",
          },
        ],
        url: "https://www.runpod.io/marketplace/pricing",
        notes:
          "Token-equivalent pricing calculated from RunPod A40 pod throughput, 2024-09.",
        tags: ["marketplace", "dedicated"],
      },
    ],
  },
  "xai-grok": {
    provider: "xAI",
    catalogUrl: "https://x.ai/",
    models: [
      {
        id: "grok-premium",
        name: "Grok via X Premium",
        category: "Subscription",
        provider: "xAI",
        modes: [
          {
            type: "subscription",
            unit: "perMonth",
            price: 8,
            description: "X Premium annual-equivalent pricing",
            usageIncluded: "Access to Grok with standard rate limits",
            features: ["General availability", "Limited rate limits"],
          },
        ],
        url: "https://help.twitter.com/en/using-x/x-premium",
        notes:
          "X Premium billed at $8/mo when paid annually (or $11 month-to-month); Grok availability subject to regional rollout.",
        tags: ["subscription"],
      },
      {
        id: "grok-premium-plus",
        name: "Grok via X Premium+",
        category: "Subscription",
        provider: "xAI",
        modes: [
          {
            type: "subscription",
            unit: "perMonth",
            price: 16,
            description: "X Premium+ monthly plan",
            usageIncluded: "Priority Grok access & highest rate limits",
            features: [
              "No ads on X",
              "Full Grok feature set",
              "Higher request caps",
            ],
          },
        ],
        url: "https://help.twitter.com/en/using-x/x-premium",
        notes: "Pricing captured 2024-09.",
        tags: ["subscription", "premium"],
      },
    ],
  },
  "stability-ai": {
    provider: "Stability AI",
    catalogUrl: "https://stability.ai/pricing",
    models: [
      {
        id: "stability-standard-plan",
        name: "Stable Diffusion Standard",
        category: "Subscription",
        provider: "Stability AI",
        modes: [
          {
            type: "subscription",
            unit: "perMonth",
            price: 27,
            description: "Standard membership",
            usageIncluded: "500 credits/month",
            features: ["Commercial usage", "Member gallery"],
          },
          {
            type: "credit",
            unit: "perCredit",
            price: 0.054,
            creditsIncluded: 500,
            description: "Effective credit rate within plan",
          },
        ],
        url: "https://stability.ai/pricing",
        notes: "Pricing captured 2024-08; credit usage varies by model.",
        tags: ["subscription", "image"],
      },
      {
        id: "stability-pro-plan",
        name: "Stable Diffusion Pro",
        category: "Subscription",
        provider: "Stability AI",
        modes: [
          {
            type: "subscription",
            unit: "perMonth",
            price: 99,
            description: "Pro membership tier",
            usageIncluded: "2,000 credits/month",
            features: [
              "Highest priority",
              "Custom style builder",
              "Team seat management",
            ],
          },
          {
            type: "credit",
            unit: "perCredit",
            price: 0.0495,
            creditsIncluded: 2000,
            description: "Effective credit rate within plan",
          },
        ],
        url: "https://stability.ai/pricing",
        notes: "Pricing captured 2024-08.",
        tags: ["subscription", "image"],
      },
      {
        id: "stability-payg",
        name: "Stable Diffusion Pay-as-you-go",
        category: "Credits",
        provider: "Stability AI",
        modes: [
          {
            type: "credit",
            unit: "perBundle",
            price: 10,
            creditsIncluded: 100,
            description: "One-time credit pack",
          },
        ],
        url: "https://stability.ai/pricing",
        notes: "Bundles from $10 for 100 credits; larger packs offer discounts.",
        tags: ["credits", "image"],
      },
    ],
  },
  midjourney: {
    provider: "Midjourney",
    catalogUrl:
      "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
    models: [
      {
        id: "midjourney-basic",
        name: "Midjourney Basic",
        category: "Subscription",
        provider: "Midjourney",
        modes: [
          {
            type: "subscription",
            unit: "perMonth",
            price: 10,
            description: "Basic plan, billed monthly",
            usageIncluded: "3.3 fast-hours, unlimited relaxed",
            features: ["General commercial terms", "Community galleries"],
          },
        ],
        url: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
        notes:
          "Annual billing discounts available; plan includes ~200 fast minutes.",
        tags: ["subscription", "image"],
      },
      {
        id: "midjourney-standard",
        name: "Midjourney Standard",
        category: "Subscription",
        provider: "Midjourney",
        modes: [
          {
            type: "subscription",
            unit: "perMonth",
            price: 30,
            description: "Most popular tier",
            usageIncluded: "15 fast-hours + unlimited relaxed",
            features: ["Stealth mode add-on", "Max 3 concurrent jobs"],
          },
        ],
        url: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
        notes: "Annual plan averages $24/month.",
        tags: ["subscription", "image"],
      },
      {
        id: "midjourney-pro",
        name: "Midjourney Pro",
        category: "Subscription",
        provider: "Midjourney",
        modes: [
          {
            type: "subscription",
            unit: "perMonth",
            price: 60,
            description: "Professional tier",
            usageIncluded: "30 fast-hours + unlimited relaxed",
            features: ["Stealth mode included", "Max 12 concurrent jobs"],
          },
        ],
        url: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
        notes: "Annual plan averages $48/month.",
        tags: ["subscription", "image"],
      },
      {
        id: "midjourney-mega",
        name: "Midjourney Mega",
        category: "Subscription",
        provider: "Midjourney",
        modes: [
          {
            type: "subscription",
            unit: "perMonth",
            price: 120,
            description: "High-volume studio tier",
            usageIncluded: "60 fast-hours + priority queues",
            features: ["Stealth mode", "Max 12 concurrent jobs"],
          },
        ],
        url: "https://docs.midjourney.com/hc/en-us/articles/27870484040333-Comparing-Midjourney-Plans",
        notes: "Annual plan averages $96/month.",
        tags: ["subscription", "image"],
      },
    ],
  },
  openrouter: {
    provider: "OpenRouter",
    catalogUrl: "https://openrouter.ai/pricing",
    models: [
      {
        id: "openrouter-llama3-70b",
        name: "Llama 3 70B (OpenRouter)",
        category: "Marketplace tokens",
        provider: "OpenRouter",
        modes: [
          {
            type: "range",
            unit: "per1Mtokens",
            min: 0.6,
            max: 0.85,
            description: "Varies by upstream host; excludes marketplace fee",
          },
          {
            type: "token",
            unit: "per1Mtokens",
            input: 0.6,
            output: 0.75,
            description: "Representative default route pricing",
          },
        ],
        url: "https://openrouter.ai/pricing",
        notes:
          "Pricing captured 2024-09; expect ±10% fluctuation. Include markup when comparing to direct providers.",
        tags: ["marketplace"],
      },
      {
        id: "openrouter-gpt-4o",
        name: "GPT-4o (OpenRouter)",
        category: "Marketplace tokens",
        provider: "OpenRouter",
        modes: [
          {
            type: "range",
            unit: "per1Mtokens",
            min: 2.5,
            max: 4.5,
            description: "Depends on selected route and availability",
          },
        ],
        url: "https://openrouter.ai/pricing",
        notes:
          "Route selection can change pricing dynamically; consider cached-token rates when available.",
        tags: ["marketplace"],
      },
      {
        id: "openrouter-mixtral-8x7b",
        name: "Mixtral 8x7B (OpenRouter)",
        category: "Marketplace tokens",
        provider: "OpenRouter",
        modes: [
          {
            type: "token",
            unit: "per1Mtokens",
            input: 0.3,
            output: 0.6,
            description: "Representative default route",
          },
        ],
        url: "https://openrouter.ai/pricing",
        notes: "Pricing captured 2024-09.",
        tags: ["marketplace", "moe"],
      },
    ],
  },
};

export const fetchAdditionalProviders =
  async (): Promise<AdditionalProviderPayloads> => {
    return STATIC_ADDITIONAL_PROVIDERS;
  };

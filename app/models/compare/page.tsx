import {
  ProviderComparison,
  type ProviderPreset,
} from "@/app/models/_components/ProviderComparison";
import { AnimatedMainContainer } from "@/components/animated-main-container";
import { getAdditionalPricingCatalog } from "@/lib/additional-models";
import {
  getProviderSummary,
  listProviderNames,
  summarizeProviderStats,
} from "@/lib/provider-summary";
import type {
  ProviderStats,
  ProviderSummary,
} from "@/lib/provider-summary";
import { getAllModels } from "@/lib/models";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Provider pricing comparisons • TokenTally",
  description:
    "Side-by-side AI provider pricing comparisons across token, subscription, credit, and compute offerings.",
};

export default function ProviderComparisonPage() {
  const allModels = getAllModels();
  const additionalCatalog = getAdditionalPricingCatalog();
  const providerOptions = listProviderNames(allModels, additionalCatalog);
  const presetCandidates: ProviderPreset[] = [
    { label: "OpenAI vs Anthropic", providers: ["OpenAI", "Anthropic"] },
    { label: "OpenAI vs Google", providers: ["OpenAI", "Google"] },
    { label: "OpenAI vs Mistral", providers: ["OpenAI", "Mistral"] },
    { label: "OpenAI vs OpenRouter", providers: ["OpenAI", "OpenRouter"] },
    { label: "Anthropic vs Mistral", providers: ["Anthropic", "Mistral"] },
    { label: "Groq vs Meta Llama", providers: ["Groq", "Meta Llama"] },
    {
      label: "Midjourney vs Stability AI",
      providers: ["Midjourney", "Stability AI"],
    },
    { label: "Mistral vs Groq", providers: ["Mistral", "Groq"] },
  ];
  const providerPresets = presetCandidates.filter((preset) =>
    preset.providers.every((provider) => providerOptions.includes(provider))
  );
  const providerData = providerOptions.reduce<
    Record<string, { summary: ProviderSummary; stats: ProviderStats }>
  >((acc, provider) => {
    const summary = getProviderSummary(provider, allModels, additionalCatalog);
    const stats = summarizeProviderStats(summary);
    acc[provider] = { summary, stats };
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Provider comparison dashboard</h1>
        <p className="text-muted-foreground">
          Explore providers side-by-side, comparing token pricing, context windows,
          and curated subscription or marketplace offerings.
        </p>
      </header>
      <AnimatedMainContainer>
        <ProviderComparison
          providerOptions={providerOptions}
          providerData={providerData}
          presets={providerPresets}
        />
      </AnimatedMainContainer>
    </div>
  );
}

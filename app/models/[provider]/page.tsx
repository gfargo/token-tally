import { AdditionalModeSummary } from "@/components/additional-mode-summary";
import { AnimatedMainContainer } from "@/components/animated-main-container";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PRICING_LAST_UPDATED } from "@/config/pricing";
import { getAdditionalPricingCatalog } from "@/lib/additional-models";
import {
  getProviderSummary,
  listProviderNames,
  summarizeProviderStats,
} from "@/lib/provider-summary";
import { getAllModels } from "@/lib/models";
import {
  getCalculatorUrl,
  getProviderDetailUrl,
  getProviderSlug,
} from "@/utils/providerUtils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DollarSign,
  FileText,
  ImageIcon,
  LayoutTemplate,
  MessageSquare,
  Mic,
  Tag,
} from "lucide-react";
import { ModelCard } from "../_components/ModelCard";

type ProviderParams = {
  provider: string;
};

export async function generateMetadata({
  params,
}: {
  params: ProviderParams;
}): Promise<Metadata> {
  const allModels = getAllModels();
  const additionalCatalog = getAdditionalPricingCatalog();
  const providerName = listProviderNames(allModels, additionalCatalog).find(
    (name) => getProviderSlug(name) === params.provider
  );

  if (!providerName) {
    return {
      title: "Provider not found • TokenTally",
    };
  }

  return {
    title: `${providerName} pricing overview • TokenTally`,
    description: `Detailed pricing breakdown for ${providerName}, including token, subscription, credit, and compute-based offerings.`,
  };
}

export default function ProviderPage({ params }: { params: ProviderParams }) {
  const allModels = getAllModels();
  const additionalCatalog = getAdditionalPricingCatalog();
  const providerName = listProviderNames(allModels, additionalCatalog).find(
    (name) => getProviderSlug(name) === params.provider
  );

  if (!providerName) {
    notFound();
  }

  const summary = getProviderSummary(
    providerName,
    allModels,
    additionalCatalog
  );
  const stats = summarizeProviderStats(summary);

  const hasCanonical =
    summary.textModels.length ||
    summary.imageModels.length ||
    summary.embeddingModels.length ||
    summary.audioModels.length;
  const hasCurated = summary.curatedEntries.length > 0;

  if (!hasCanonical && !hasCurated) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative space-y-6">
      <Link
        href="/models"
        className="text-sm text-muted-foreground underline"
      >
        ← Back to catalog
      </Link>
      <header className="space-y-2 mt-3">
        <h1 className="text-3xl font-bold">{providerName} Pricing Overview</h1>
        <p className="text-muted-foreground">
          Explore token-based, subscription, credit, and compute pricing for{" "}
          {providerName}. Data snapshot: {PRICING_LAST_UPDATED}.
        </p>
        <div className="text-sm text-muted-foreground flex flex-wrap gap-3">
          <span>Text models: {stats.textModelCount}</span>
          {stats.minInputCost && (
            <span>
              Lowest input: ${stats.minInputCost.value.toFixed(3)} (
              {stats.minInputCost.model})
            </span>
          )}
          {stats.maxContextWindow && (
            <span>
              Max context: {stats.maxContextWindow.value.toLocaleString()}{" "}
              tokens ({stats.maxContextWindow.model})
            </span>
          )}
          {stats.curatedEntryCount > 0 && (
            <span>Curated plans: {stats.curatedEntryCount}</span>
          )}
        </div>
      </header>
      <AnimatedMainContainer>
        <div className="space-y-12">
          {summary.textModels.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Text Generation
                </h2>
                <Link
                  href={getCalculatorUrl(providerName)}
                  className="text-sm underline text-muted-foreground"
                >
                  Jump to calculator
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summary.textModels.map((model, index) => (
                  <ModelCard
                    key={`${model.model}_${index}`}
                    model={model}
                  />
                ))}
              </div>
            </section>
          )}

          {summary.imageModels.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <ImageIcon className="h-6 w-6" />
                  Image Generation
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summary.imageModels.map((model) => (
                  <Card
                    key={model.model}
                    className="flex flex-col h-full"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="h-5 w-5" />
                          <span>{model.model}</span>
                        </CardTitle>
                        <Link href={getProviderDetailUrl(model.provider)}>
                          <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80"
                          >
                            {model.provider}
                          </Badge>
                        </Link>
                      </div>
                      <CardDescription>{model.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          Price: ${(model?.price || 0).toFixed(4)} {model.unit}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {summary.embeddingModels.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Embeddings
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summary.embeddingModels.map((model) => (
                  <Card
                    key={model.model}
                    className="flex flex-col h-full"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          <span>{model.model}</span>
                        </CardTitle>
                        <Link href={getProviderDetailUrl(model.provider)}>
                          <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80"
                          >
                            {model.provider}
                          </Badge>
                        </Link>
                      </div>
                      <CardDescription>{model.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          Price: ${(model?.price || 0).toFixed(4)} {model.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          Context: {model.context}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {summary.audioModels.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Mic className="h-6 w-6" />
                  Audio
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summary.audioModels.map((model) => (
                  <Card
                    key={model.model}
                    className="flex flex-col h-full"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Mic className="h-5 w-5" />
                          <span>{model.model}</span>
                        </CardTitle>
                        <Link href={getProviderDetailUrl(model.provider)}>
                          <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80"
                          >
                            {model.provider}
                          </Badge>
                        </Link>
                      </div>
                      <CardDescription>{model.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          Price: ${(model?.price || 0).toFixed(4)} {model.unit}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {hasCurated && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Tag className="h-6 w-6" />
                Marketplace & Subscription Offerings
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {summary.curatedEntries.map((entry) => (
                  <Card
                    key={`${entry.providerKey}-${entry.modelId}`}
                    className="flex flex-col h-full"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-lg">{entry.name}</CardTitle>
                          <CardDescription>{entry.category}</CardDescription>
                        </div>
                        <Link href={getProviderDetailUrl(entry.provider)}>
                          <Badge
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80"
                          >
                            {entry.provider}
                          </Badge>
                        </Link>
                      </div>
                      {entry.vendor ? (
                        <p className="text-xs text-muted-foreground">
                          Vendor: {entry.vendor}
                        </p>
                      ) : null}
                      {entry.region ? (
                        <p className="text-xs text-muted-foreground">
                          Region: {entry.region}
                        </p>
                      ) : null}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {entry.modes.map((mode, index) => (
                          <AdditionalModeSummary
                            key={`${entry.modelId}-mode-${index}`}
                            mode={mode}
                          />
                        ))}
                      </div>
                      {entry.notes ? (
                        <p className="text-xs text-muted-foreground">
                          {entry.notes}
                        </p>
                      ) : null}
                      {entry.catalogUrl ? (
                        <a
                          href={entry.catalogUrl}
                          className="text-xs underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View provider catalog
                        </a>
                      ) : null}
                      {entry.tags?.length ? (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag) => (
                            <Badge
                              key={`${entry.modelId}-${tag}`}
                              variant="outline"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Curated data is maintained manually; upstream plan changes may
                require confirmation before automation catches them.
              </p>
            </section>
          )}
        </div>
      </AnimatedMainContainer>
    </div>
  );
}

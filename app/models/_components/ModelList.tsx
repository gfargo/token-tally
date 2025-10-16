"use client";

import { AdditionalModeSummary } from "@/components/additional-mode-summary";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdditionalPricingRow } from "@/lib/additional-models";
import { AllModelsReturn } from "@/lib/models";
import { getCalculatorUrl, getProviderDetailUrl } from "@/utils/providerUtils";
import {
  DollarSign,
  FileText,
  ImageIcon,
  LayoutTemplate,
  MessageSquare,
  Mic,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ModelCard } from "./ModelCard";

export const ModelList = ({
  allModels,
  providers,
  additionalCatalog,
}: {
  allModels: AllModelsReturn;
  providers: string[];
  additionalCatalog: AdditionalPricingRow[];
}) => {
  const [selectedProvider, setSelectedProvider] = useState("All");

  const filteredModels = useMemo(() => {
    if (selectedProvider === "All") {
      return allModels;
    }
    return {
      textModels: allModels.textModels.filter(
        (model) => model.provider === selectedProvider
      ),
      imageModels: allModels.imageModels.filter(
        (model) => model.provider === selectedProvider
      ),
      embeddingModels: allModels.embeddingModels.filter(
        (model) => model.provider === selectedProvider
      ),
      audioModels: allModels.audioModels.filter(
        (model) => model.provider === selectedProvider
      ),
    };
  }, [selectedProvider, allModels]);

  const filteredAdditionalCatalog = useMemo(() => {
    if (selectedProvider === "All") {
      return additionalCatalog;
    }
    return additionalCatalog.filter(
      (entry) => entry.provider === selectedProvider
    );
  }, [selectedProvider, additionalCatalog]);

  return (
    <>
      <div className="w-64 self-end ml-auto">
        <Select
          value={selectedProvider}
          onValueChange={setSelectedProvider}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem
                key={provider}
                value={provider}
              >
                {provider}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-12">
        {filteredModels.textModels.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Text Generation Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.textModels.map((model, index) => (
                <ModelCard
                  key={`${model.model}_${index}`}
                  model={model}
                />
              ))}
            </div>
          </section>
        )}

        {filteredModels.imageModels.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="h-6 w-6" />
              Image Generation Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.imageModels.map((model) => (
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
                      <Link href={getCalculatorUrl(model.provider)}>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                        >
                          {model.provider}
                        </Badge>
                      </Link>
                      <Link
                        href={getProviderDetailUrl(model.provider)}
                        className="text-xs underline text-muted-foreground"
                      >
                        Provider details
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

        {filteredModels.embeddingModels.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Embedding Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.embeddingModels.map((model) => (
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
                      <Link href={getCalculatorUrl(model.provider)}>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                        >
                          {model.provider}
                        </Badge>
                      </Link>
                      <Link
                        href={getProviderDetailUrl(model.provider)}
                        className="text-xs underline text-muted-foreground"
                      >
                        Provider details
                      </Link>
                    </div>
                    <CardDescription>{model.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {filteredModels.audioModels.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Mic className="h-6 w-6" />
              Audio Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModels.audioModels.map((model) => (
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
                      <Link href={getCalculatorUrl(model.provider)}>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                        >
                          {model.provider}
                        </Badge>
                      </Link>
                      <Link
                        href={getProviderDetailUrl(model.provider)}
                        className="text-xs underline text-muted-foreground"
                      >
                        Provider details
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

        {filteredAdditionalCatalog.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Tag className="h-6 w-6" />
              Marketplace & Subscription Offerings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAdditionalCatalog.map((entry) => (
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
                      <p className="text-xs text-muted-foreground">{entry.notes}</p>
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
          </section>
        )}

        {Object.values(filteredModels).every((models) => models.length === 0) &&
          filteredAdditionalCatalog.length === 0 && (
          <p className="text-center text-muted-foreground">
            No models found for the selected provider.
          </p>
        )}
      </div>
    </>
  );
};

"use client";

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
import { AllModelsReturn } from '@/lib/models';
import { getCalculatorUrl } from "@/utils/providerUtils";
import {
  DollarSign,
  FileText,
  ImageIcon,
  LayoutTemplate,
  MessageSquare,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ModelCard } from "./ModelCard";

export const ModelList = ({
  allModels,
  providers,
}: {
  allModels: AllModelsReturn;
  providers: string[];
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

        {Object.values(filteredModels).every(
          (models) => models.length === 0
        ) && (
          <p className="text-center text-muted-foreground">
            No models found for the selected provider.
          </p>
        )}
      </div>
    </>
  );
};

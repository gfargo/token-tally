"use client";

import { ModelCostCharts } from "@/components/model-cost-charts";
import { ModelCostComparisonChart } from "@/components/model-cost-comparison-chart";
import { ModelMetadataCard } from "@/components/model-metadata-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { perplexityPricing } from "@/config/pricing";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const chartData = Object.entries(perplexityPricing).map(
  ([modelName, data]) => ({
    model: modelName,
    inputCost: data.input,
    outputCost: data.output,
  })
);

// combined pricing type to handle different pricing structures between models in config/pricing.ts
type CombinedPricing = {
  input: number;
  output: number;
  reasoning?: number;
  searchPrice?: number;
  category?: string;
};

export default function PerplexityCalculator() {
  const [model, setModel] = useState("sonar-deep-research");
  const [inputTokens, setInputTokens] = useState(1000);
  const [reasoningTokens, setReasoningTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(500);
  const [searches, setSearches] = useState(1);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("token");

  const calculateCost = () => {
    if (
      !inputTokens ||
      !outputTokens ||
      (model === "sonar-deep-research" && !reasoningTokens)
    ) {
      toast.error("Missing values", {
        description: "Please enter all required token counts",
      });
      return;
    }

    const pricing = perplexityPricing[
      model as keyof typeof perplexityPricing
    ] as CombinedPricing;

    // Calculate cost per token (converting from per million)
    const inputCostPerToken = pricing.input / 1_000_000;
    const outputCostPerToken = pricing.output / 1_000_000;
    const reasoningCostPerToken =
      "reasoning" in pricing && pricing.reasoning
        ? pricing.reasoning / 1_000_000
        : 0;

    // Calculate total cost
    const totalInputCost = inputTokens * inputCostPerToken;
    const totalOutputCost = outputTokens * outputCostPerToken;
    const totalReasoningCost = reasoningTokens * reasoningCostPerToken;
    const totalTokenCost =
      totalInputCost + totalOutputCost + totalReasoningCost;

    // Calculate search cost
    const searchCost =
      "searchPrice" in pricing && pricing.searchPrice
        ? (searches * pricing.searchPrice) / 1000
        : 0;

    const total = totalTokenCost + searchCost;

    setCalculatedCost(total);
  };

  const calculateAverageCosts = () => {
    const models = Object.values(perplexityPricing) as CombinedPricing[];
    const totalInputCost = models.reduce((sum, model) => sum + model.input, 0);
    const totalOutputCost = models.reduce(
      (sum, model) => sum + model.output,
      0
    );
    return {
      averageInputCost: totalInputCost / models.length,
      averageOutputCost: totalOutputCost / models.length,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="token">Token Cost Calculator</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Table</TabsTrigger>
        </TabsList>

        <TabsContent value="token">
          <Card>
            <CardHeader>
              <CardTitle>Token Cost Calculator</CardTitle>
              <CardDescription>
                Enter the number of tokens to calculate the cost
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="model">Select Model</Label>
                  <Select
                    value={model}
                    onValueChange={setModel}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sonar-deep-research">
                        Sonar Deep Research
                      </SelectItem>
                      <SelectItem value="sonar-reasoning-pro">
                        Sonar Reasoning Pro
                      </SelectItem>
                      <SelectItem value="sonar-reasoning">
                        Sonar Reasoning
                      </SelectItem>
                      <SelectItem value="sonar-pro">Sonar Pro</SelectItem>
                      <SelectItem value="sonar">Sonar</SelectItem>
                      <SelectItem value="r1-1776">R1-1776</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Input Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {perplexityPricing[
                        model as keyof typeof perplexityPricing
                      ].input.toFixed(2)}{" "}
                      / 1M tokens
                    </div>
                  </div>
                  <div>
                    <Label>Output Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {perplexityPricing[
                        model as keyof typeof perplexityPricing
                      ].output.toFixed(2)}{" "}
                      / 1M tokens
                    </div>
                  </div>
                  {model === "sonar-deep-research" && (
                    <div>
                      <Label>Reasoning Cost</Label>
                      <div className="text-lg font-medium">
                        $
                        {perplexityPricing[
                          "sonar-deep-research"
                        ].reasoning.toFixed(2)}{" "}
                        / 1M tokens
                      </div>
                    </div>
                  )}
                  {(perplexityPricing[
                    model as keyof typeof perplexityPricing
                  ] as { searchPrice?: number }) &&
                    "searchPrice" in
                      perplexityPricing[
                        model as keyof typeof perplexityPricing
                      ] && (
                      <div>
                        <Label>Search Price</Label>
                        <div className="text-lg font-medium">
                          $
                          {"searchPrice" in
                            perplexityPricing[
                              model as keyof typeof perplexityPricing
                            ] &&
                            (
                              perplexityPricing[
                                model as keyof typeof perplexityPricing
                              ] as { searchPrice: number }
                            ).searchPrice.toFixed(2)}{" "}
                          / 1000 searches
                        </div>
                      </div>
                    )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="input-tokens">Input Tokens</Label>
                    <span className="text-sm text-muted-foreground">
                      ~{Math.round(inputTokens * 0.75)} words
                    </span>
                  </div>
                  <Input
                    id="input-tokens"
                    type="number"
                    value={inputTokens}
                    onChange={(e) =>
                      setInputTokens(Number.parseInt(e.target.value) || 0)
                    }
                  />
                </div>

                {model === "sonar-deep-research" && (
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="reasoning-tokens">Reasoning Tokens</Label>
                      <span className="text-sm text-muted-foreground">
                        ~{Math.round(reasoningTokens * 0.75)} words
                      </span>
                    </div>
                    <Input
                      id="reasoning-tokens"
                      type="number"
                      value={reasoningTokens}
                      onChange={(e) =>
                        setReasoningTokens(Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="output-tokens">Output Tokens</Label>
                    <span className="text-sm text-muted-foreground">
                      ~{Math.round(outputTokens * 0.75)} words
                    </span>
                  </div>
                  <Input
                    id="output-tokens"
                    type="number"
                    value={outputTokens}
                    onChange={(e) =>
                      setOutputTokens(Number.parseInt(e.target.value) || 0)
                    }
                  />
                </div>

                {(
                  perplexityPricing[
                    model as keyof typeof perplexityPricing
                  ] as CombinedPricing
                ).searchPrice && (
                  <div>
                    <Label htmlFor="searches">Number of Searches</Label>
                    <Input
                      id="searches"
                      type="number"
                      value={searches}
                      onChange={(e) =>
                        setSearches(Number.parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={calculateCost}
                className="w-full bg-[#FFCD6F] hover:bg-[#E5B85F] text-black"
              >
                Calculate Cost
              </Button>
            </CardFooter>
          </Card>

          {calculatedCost !== null && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Cost Estimation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">
                    ${calculatedCost.toFixed(6)}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Estimated cost for this request
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="border rounded-md p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Input Cost
                    </div>
                    <div className="font-medium">
                      $
                      {(
                        (inputTokens *
                          perplexityPricing[
                            model as keyof typeof perplexityPricing
                          ].input) /
                        1_000_000
                      ).toFixed(6)}
                    </div>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      Output Cost
                    </div>
                    <div className="font-medium">
                      $
                      {(
                        (outputTokens *
                          perplexityPricing[
                            model as keyof typeof perplexityPricing
                          ].output) /
                        1_000_000
                      ).toFixed(6)}
                    </div>
                  </div>
                  {model === "sonar-deep-research" && (
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Reasoning Cost
                      </div>
                      <div className="font-medium">
                        $
                        {(
                          (reasoningTokens *
                            perplexityPricing["sonar-deep-research"]
                              .reasoning) /
                          1_000_000
                        ).toFixed(6)}
                      </div>
                    </div>
                  )}
                  {(
                    perplexityPricing[
                      model as keyof typeof perplexityPricing
                    ] as CombinedPricing
                  ).searchPrice && (
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Search Cost
                      </div>
                      <div className="font-medium">
                        $
                        {(
                          (searches *
                            (
                              perplexityPricing[
                                model as keyof typeof perplexityPricing
                              ] as CombinedPricing
                            ).searchPrice!) /
                          1000
                        ).toFixed(6)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">
                    1,000,000 similar requests would cost:
                  </Label>
                  <div className="text-xl font-bold">
                    ${(calculatedCost * 1_000_000).toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Perplexity.ai Model Pricing</CardTitle>
              <CardDescription>
                Current pricing for Perplexity.ai API models (per million
                tokens)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Input
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Reasoning
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Output
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Search Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(perplexityPricing).map(
                      ([modelName, pricing]) => (
                        <tr key={modelName}>
                          <td className="px-4 py-3">{modelName}</td>
                          <td className="px-4 py-3 text-right">
                            ${pricing.input.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {"reasoning" in pricing &&
                            pricing.reasoning !== undefined
                              ? `$${pricing.reasoning.toFixed(2)}`
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${pricing.output.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {"searchPrice" in pricing && pricing.searchPrice
                              ? `$${pricing.searchPrice.toFixed(2)}`
                              : "-"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Prices are based on the latest available information. Pricing
                may change over time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ModelMetadataCard
            metadata={{
              name: model,
              provider: "Perplexity.ai",
              category:
                perplexityPricing[model as keyof typeof perplexityPricing]
                  .category,
              inputCost:
                perplexityPricing[model as keyof typeof perplexityPricing]
                  .input,
              outputCost:
                perplexityPricing[model as keyof typeof perplexityPricing]
                  .output,
            }}
          />
          <ModelCostComparisonChart
            modelName={model}
            modelInputCost={
              perplexityPricing[model as keyof typeof perplexityPricing].input
            }
            modelOutputCost={
              perplexityPricing[model as keyof typeof perplexityPricing].output
            }
            averageInputCost={calculateAverageCosts().averageInputCost}
            averageOutputCost={calculateAverageCosts().averageOutputCost}
          />
        </div>
        <ModelCostCharts data={chartData} />
      </div>
    </motion.div>
  );
}

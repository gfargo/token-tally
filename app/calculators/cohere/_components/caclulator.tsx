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
import { coherePricing } from "@/config/pricing";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const chartData = Object.entries(coherePricing).map(([modelName, data]) => ({
  model: modelName,
  inputCost: data.input ?? 0,
  outputCost: data.output ?? 0,
}));

export default function CohereCalculator() {
  const [model, setModel] = useState("command");
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(5000);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("token");

  const calculateCost = () => {
    if (!inputTokens || !outputTokens) {
      toast.error("Missing values", {
        description: "Please enter both input and output tokens",
      });
      return;
    }

    const pricing = coherePricing[model as keyof typeof coherePricing];

    // Calculate cost per token (converting from per million)
    const inputCostPerToken = (pricing.input ?? 0) / 1_000_000;
    const outputCostPerToken = (pricing.output ?? 0) / 1_000_000;

    // Calculate total cost
    const totalInputCost = inputTokens * inputCostPerToken;
    const totalOutputCost = outputTokens * outputCostPerToken;
    const total = totalInputCost + totalOutputCost;

    setCalculatedCost(total);
  };

  const calculateAverageCosts = () => {
    const models = Object.values(coherePricing);
    const totalInputCost = models.reduce((sum, model) => sum + (model.input ?? 0), 0);
    const totalOutputCost = models.reduce(
      (sum, model) => sum + (model.output ?? 0),
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
                      <SelectItem value="command">Command</SelectItem>
                      <SelectItem value="command-light">
                        Command Light
                      </SelectItem>
                      <SelectItem value="command-r">Command R</SelectItem>
                      <SelectItem value="command-r-plus">Command R+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Input Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {(coherePricing[
                        model as keyof typeof coherePricing
                      ].input ?? 0).toFixed(2)}{" "}
                      / 1M tokens
                    </div>
                  </div>
                  <div>
                    <Label>Output Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {(coherePricing[
                        model as keyof typeof coherePricing
                      ].output ?? 0).toFixed(2)}{" "}
                      / 1M tokens
                    </div>
                  </div>
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
                          (coherePricing[model as keyof typeof coherePricing]
                            .input ?? 0)) /
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
                          (coherePricing[model as keyof typeof coherePricing]
                            .output ?? 0)) /
                        1_000_000
                      ).toFixed(6)}
                    </div>
                  </div>
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
              <CardTitle>Cohere Model Pricing</CardTitle>
              <CardDescription>
                Current pricing for Cohere API models (per million tokens)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Input (per 1M tokens)
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Output (per 1M tokens)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(coherePricing).map(
                      ([modelName, pricing]) => (
                        <tr key={modelName}>
                          <td className="px-4 py-3">{modelName}</td>
                          <td className="px-4 py-3 text-right">
                            ${(pricing.input ?? 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${(pricing.output ?? 0).toFixed(2)}
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
              provider: "Cohere",
              category:
                coherePricing[model as keyof typeof coherePricing].category ?? "Unknown",
              inputCost:
                coherePricing[model as keyof typeof coherePricing].input ?? 0,
              outputCost:
                coherePricing[model as keyof typeof coherePricing].output ?? 0,
            }}
          />
          <ModelCostComparisonChart
            modelName={model}
            modelInputCost={
              coherePricing[model as keyof typeof coherePricing].input ?? 0
            }
            modelOutputCost={
              coherePricing[model as keyof typeof coherePricing].output ?? 0
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

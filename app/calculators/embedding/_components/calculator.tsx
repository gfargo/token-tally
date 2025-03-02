"use client";

import { CardFooter } from "@/components/ui/card";

import { ModelCostCharts } from "@/components/model-cost-charts";
import { ModelCostComparisonChart } from "@/components/model-cost-comparison-chart";
import { ModelMetadataCard } from "@/components/model-metadata-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { embeddingPricing } from "@/config/pricing";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const chartData = Object.entries(embeddingPricing).map(([modelName, data]) => ({
  model: modelName,
  inputCost: data.price,
  outputCost: data.price,
}));
 
export default function EmbeddingsCalculator() {
  const [model, setModel] = useState("text-embedding-3-small");
  const [tokens, setTokens] = useState(1000);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");

  const calculateCost = () => {
    if (!tokens || tokens < 1) {
      toast.error("Invalid input", {
        description: "Please enter a positive number of tokens",
      });
      return;
    }

    const pricing = embeddingPricing[model as keyof typeof embeddingPricing];
    const costPerToken = pricing.price / 1_000_000;
    const total = tokens * costPerToken;

    setCalculatedCost(total);
  };

  const calculateAverageCosts = () => {
    const models = Object.values(embeddingPricing);
    const totalCost = models.reduce((sum, model) => sum + model.price, 0);
    return {
      averageCost: totalCost / models.length,
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
          <TabsTrigger value="calculator">Embedding Calculator</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Table</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Embedding Cost Calculator</CardTitle>
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
                      <SelectItem value="text-embedding-3-small">
                        OpenAI - text-embedding-3-small
                      </SelectItem>
                      <SelectItem value="text-embedding-3-large">
                        OpenAI - text-embedding-3-large
                      </SelectItem>
                      <SelectItem value="text-embedding-ada-002">
                        OpenAI - text-embedding-ada-002
                      </SelectItem>
                      <SelectItem value="cohere-embed-english-v3.0">
                        Cohere - embed-english-v3.0
                      </SelectItem>
                      <SelectItem value="cohere-embed-multilingual-v3.0">
                        Cohere - embed-multilingual-v3.0
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Label>Cost</Label>
                  <div className="text-lg font-medium">
                    $
                    {embeddingPricing[
                      model as keyof typeof embeddingPricing
                    ].price.toFixed(2)}{" "}
                    / 1M tokens
                  </div>
                </div>

                <div className="pt-2">
                  <Label>Context Length</Label>
                  <div className="text-lg font-medium">
                    {
                      embeddingPricing[model as keyof typeof embeddingPricing]
                        .context
                    }
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="tokens">Number of Tokens</Label>
                    <span className="text-sm text-muted-foreground">
                      ~{Math.round(tokens * 0.75)} words
                    </span>
                  </div>
                  <Input
                    id="tokens"
                    type="number"
                    min="1"
                    value={tokens}
                    onChange={(e) =>
                      setTokens(Number.parseInt(e.target.value) || 0)
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
                    Estimated cost for {tokens.toLocaleString()} tokens
                  </p>
                </div>

                <div className="mt-4 border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Model</div>
                      <div className="font-medium">{model}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Tokens
                      </div>
                      <div className="font-medium">
                        {tokens.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Cost Per Million Tokens
                      </div>
                      <div className="font-medium">
                        $
                        {embeddingPricing[
                          model as keyof typeof embeddingPricing
                        ].price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">
                    1,000,000 similar requests would cost:
                  </Label>
                  <div className="text-xl font-bold mt-1">
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
              <CardTitle>Embedding Models Pricing</CardTitle>
              <CardDescription>
                Current pricing for embedding models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Price (per 1M tokens)
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Context Length
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Provider
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(embeddingPricing).map(
                      ([modelName, data]) => (
                        <tr key={modelName}>
                          <td className="px-4 py-3">{modelName}</td>
                          <td className="px-4 py-3 text-right">
                            ${data.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {data.context}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {data.provider}
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
              provider:
                embeddingPricing[model as keyof typeof embeddingPricing]
                  .provider,
              category: "Embedding",
              inputCost:
                embeddingPricing[model as keyof typeof embeddingPricing].price,
              outputCost:
                embeddingPricing[model as keyof typeof embeddingPricing].price,
            }}
          />
          <ModelCostComparisonChart
            modelName={model}
            modelInputCost={
              embeddingPricing[model as keyof typeof embeddingPricing].price
            }
            modelOutputCost={
              embeddingPricing[model as keyof typeof embeddingPricing].price
            }
            averageInputCost={calculateAverageCosts().averageCost}
            averageOutputCost={calculateAverageCosts().averageCost}
          />
        </div>
        <ModelCostCharts data={chartData} />
      </div>
    </motion.div>
  );
}

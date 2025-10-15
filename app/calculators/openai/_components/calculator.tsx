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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { openaiPricing } from "@/config/pricing";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const OpenAICalculator = () => {
  // Get available models and set default to first available
  const availableModels = Object.keys(openaiPricing);
  const [model, setModel] = useState(availableModels.includes("gpt-4o") ? "gpt-4o" : availableModels[0]);
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(10000);
  const [useCache, setUseCache] = useState(false);
  const [useBatchProcessing, setUseBatchProcessing] = useState(false);
  const [useAudio, setUseAudio] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("token");

  const searchParams = useSearchParams();
  const initialTokens = searchParams.get("tokens");

  useEffect(() => {
    if (initialTokens) {
      setInputTokens(Number(initialTokens));
      setOutputTokens(Number(initialTokens));
    }
  }, [initialTokens]);

  const calculateCost = () => {
    if (!inputTokens || !outputTokens) {
      toast.error("Missing values", {
        description: "Please enter both input and output tokens",
      });
      return;
    }

    const pricing = openaiPricing[model as keyof typeof openaiPricing];

    // Calculate cost per token (converting from per million)
    const inputCostPerToken =
      useAudio && "audioInput" in pricing
        ? (pricing.audioInput ?? 0) / 1_000_000
        : (pricing.input ?? 0) / 1_000_000;
    const cachedInputCostPerToken =
      useAudio && "audioCachedInput" in pricing
        ? (pricing.audioCachedInput ?? 0) / 1_000_000
        : (pricing.cachedInput ?? pricing.input ?? 0) / 1_000_000;
    const outputCostPerToken =
      useAudio && "audioOutput" in pricing
        ? (pricing.audioOutput ?? 0) / 1_000_000
        : (pricing.output ?? 0) / 1_000_000;

    // Apply batch processing discount if enabled
    const batchDiscount = useBatchProcessing ? 0.5 : 1;

    // Calculate total cost
    const inputCost = useCache
      ? cachedInputCostPerToken * inputTokens
      : inputCostPerToken * inputTokens;
    const outputCost = outputCostPerToken * outputTokens;
    const total = (inputCost + outputCost) * batchDiscount;

    setCalculatedCost(total);
  };

  const modelMetadata = openaiPricing[model as keyof typeof openaiPricing];
  const chartData = Object.entries(openaiPricing).map(([modelName, data]) => ({
    model: modelName,
    inputCost: data.input ?? 0,
    outputCost: data.output ?? 0,
  }));

  const calculateAverageCosts = () => {
    const models = Object.values(openaiPricing);
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

  // Group models by category for better UX
  const groupedModels = Object.entries(openaiPricing).reduce((acc, [modelName, pricing]) => {
    const category = pricing.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(modelName);
    return acc;
  }, {} as Record<string, string[]>);

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
          <Card className="w-full">
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
                      {Object.entries(groupedModels).map(([category, models]) => (
                        <SelectGroup key={category}>
                          <SelectLabel>{category}</SelectLabel>
                          {models.map((modelName) => (
                            <SelectItem key={modelName} value={modelName}>
                              {modelName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Input Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {(openaiPricing[
                        model as keyof typeof openaiPricing
                      ].input ?? 0).toFixed(3)}{" "}
                      / 1M tokens
                    </div>
                  </div>
                  <div>
                    <Label>Output Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {(openaiPricing[
                        model as keyof typeof openaiPricing
                      ].output ?? 0).toFixed(3)}{" "}
                      / 1M tokens
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="cache"
                    checked={useCache}
                    onCheckedChange={setUseCache}
                  />
                  <Label
                    htmlFor="cache"
                    className="flex items-center cursor-pointer"
                  >
                    Use input caching
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Input caching can reduce costs for repeated prompts
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="batch"
                    checked={useBatchProcessing}
                    onCheckedChange={setUseBatchProcessing}
                  />
                  <Label
                    htmlFor="batch"
                    className="flex items-center cursor-pointer"
                  >
                    Use batch processing (50% discount)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Batch processing offers a 50% discount on token
                            costs
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>

                {model.includes("realtime") && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="audio"
                      checked={useAudio}
                      onCheckedChange={setUseAudio}
                    />
                    <Label
                      htmlFor="audio"
                      className="flex items-center cursor-pointer"
                    >
                      Use audio input/output
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Use audio pricing for Realtime API
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                  </div>
                )}

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
                        ((inputTokens *
                          (useCache
                            ? (openaiPricing[model as keyof typeof openaiPricing]
                                .cachedInput ?? openaiPricing[model as keyof typeof openaiPricing]
                                .input ?? 0)
                            : (openaiPricing[model as keyof typeof openaiPricing]
                                .input ?? 0))) /
                          1_000_000) *
                        (useBatchProcessing ? 0.5 : 1)
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
                        ((outputTokens *
                          (openaiPricing[model as keyof typeof openaiPricing]
                            .output ?? 0)) /
                          1_000_000) *
                        (useBatchProcessing ? 0.5 : 1)
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
              <CardTitle>OpenAI Model Pricing</CardTitle>
              <CardDescription>
                Current pricing for OpenAI API models (per million tokens)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Input
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Cached Input
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Output
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(openaiPricing).map(
                      ([modelName, pricing]) => (
                        <tr key={modelName}>
                          <td className="px-4 py-3">{modelName}</td>
                          <td className="px-4 py-3 text-right">
                            ${(pricing.input ?? 0).toFixed(3)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {pricing.cachedInput ? `$${pricing.cachedInput.toFixed(3)}` : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${(pricing.output ?? 0).toFixed(3)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {pricing.category}
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
              provider: "OpenAI",
              category: modelMetadata.category,
              contextWindow:
                "contextWindow" in modelMetadata
                  ? modelMetadata.contextWindow
                  : 0,
              inputCost: modelMetadata.input ?? 0,
              outputCost: modelMetadata.output ?? 0,
            }}
          />
          <ModelCostComparisonChart
            modelName={model}
            modelInputCost={modelMetadata.input ?? 0}
            modelOutputCost={modelMetadata.output ?? 0}
            averageInputCost={calculateAverageCosts().averageInputCost}
            averageOutputCost={calculateAverageCosts().averageOutputCost}
          />
        </div>
        <ModelCostCharts data={chartData} />
      </div>
    </motion.div>
  );
};

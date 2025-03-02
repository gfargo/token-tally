"use client";

import { ModelCostCharts } from "@/components/model-cost-charts";
import { ModelCostComparisonChart } from "@/components/model-cost-comparison-chart";
import { ModelMetadataCard } from "@/components/model-metadata-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription, CardFooter, CardHeader,
  CardTitle
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { claudePricing } from "@/config/pricing";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClaudeCalculator() {
  const [model, setModel] = useState("claude-3-opus");
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(5000);
  const [useBatchProcessing, setUseBatchProcessing] = useState(false);
  const [usePromptCaching, setUsePromptCaching] = useState(false);
  const [cachingWriteTokens, setCachingWriteTokens] = useState(0);
  const [cachingReadTokens, setCachingReadTokens] = useState(0);
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

    const pricing = claudePricing[model as keyof typeof claudePricing];

    // Calculate cost per token (converting from per million)
    const inputCostPerToken = pricing.input / 1_000_000;
    const outputCostPerToken = pricing.output / 1_000_000;
    const promptCachingWriteCostPerToken =
      pricing.promptCachingWrite / 1_000_000;
    const promptCachingReadCostPerToken = pricing.promptCachingRead / 1_000_000;

    // Apply batch processing discount if enabled
    const batchDiscount = useBatchProcessing
      ? pricing.batchProcessingDiscount
      : 1;

    // Calculate total cost
    let totalInputCost = inputTokens * inputCostPerToken * batchDiscount;
    const totalOutputCost = outputTokens * outputCostPerToken * batchDiscount;

    // Add prompt caching costs if enabled
    if (usePromptCaching) {
      totalInputCost +=
        cachingWriteTokens * promptCachingWriteCostPerToken * batchDiscount;
      totalInputCost +=
        cachingReadTokens * promptCachingReadCostPerToken * batchDiscount;
    }

    const total = totalInputCost + totalOutputCost;

    setCalculatedCost(total);
  };

  const calculateAverageCosts = () => {
    const models = Object.values(claudePricing);
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

  const modelMetadata = claudePricing[model as keyof typeof claudePricing];
  const chartData = Object.entries(claudePricing).map(([modelName, data]) => ({
    model: modelName,
    inputCost: data.input,
    outputCost: data.output,
  }));

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
                      <SelectItem value="claude-3-opus">
                        Claude 3 Opus
                      </SelectItem>
                      <SelectItem value="claude-3.7-sonnet">
                        Claude 3.7 Sonnet
                      </SelectItem>
                      <SelectItem value="claude-3.5-haiku">
                        Claude 3.5 Haiku
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Input Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {claudePricing[
                        model as keyof typeof claudePricing
                      ].input.toFixed(2)}{" "}
                      / 1M tokens
                    </div>
                  </div>
                  <div>
                    <Label>Output Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {claudePricing[
                        model as keyof typeof claudePricing
                      ].output.toFixed(2)}{" "}
                      / 1M tokens
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="batch-processing"
                    checked={useBatchProcessing}
                    onCheckedChange={setUseBatchProcessing}
                  />
                  <Label
                    htmlFor="batch-processing"
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="prompt-caching"
                    checked={usePromptCaching}
                    onCheckedChange={setUsePromptCaching}
                  />
                  <Label
                    htmlFor="prompt-caching"
                    className="flex items-center cursor-pointer"
                  >
                    Use prompt caching
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Prompt caching can reduce costs for repeated prompts
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>

                {usePromptCaching && (
                  <>
                    <div>
                      <Label htmlFor="caching-write-tokens">
                        Prompt Caching Write Tokens
                      </Label>
                      <Input
                        id="caching-write-tokens"
                        type="number"
                        value={cachingWriteTokens}
                        onChange={(e) =>
                          setCachingWriteTokens(
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="caching-read-tokens">
                        Prompt Caching Read Tokens
                      </Label>
                      <Input
                        id="caching-read-tokens"
                        type="number"
                        value={cachingReadTokens}
                        onChange={(e) =>
                          setCachingReadTokens(
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </>
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
                          claudePricing[model as keyof typeof claudePricing]
                            .input) /
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
                          claudePricing[model as keyof typeof claudePricing]
                            .output) /
                          1_000_000) *
                        (useBatchProcessing ? 0.5 : 1)
                      ).toFixed(6)}
                    </div>
                  </div>
                  {usePromptCaching && (
                    <>
                      <div className="border rounded-md p-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          Prompt Caching Write Cost
                        </div>
                        <div className="font-medium">
                          $
                          {(
                            ((cachingWriteTokens *
                              claudePricing[model as keyof typeof claudePricing]
                                .promptCachingWrite) /
                              1_000_000) *
                            (useBatchProcessing ? 0.5 : 1)
                          ).toFixed(6)}
                        </div>
                      </div>
                      <div className="border rounded-md p-4">
                        <div className="text-sm text-muted-foreground mb-1">
                          Prompt Caching Read Cost
                        </div>
                        <div className="font-medium">
                          $
                          {(
                            ((cachingReadTokens *
                              claudePricing[model as keyof typeof claudePricing]
                                .promptCachingRead) /
                              1_000_000) *
                            (useBatchProcessing ? 0.5 : 1)
                          ).toFixed(6)}
                        </div>
                      </div>
                    </>
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
              <CardTitle>Claude Model Pricing</CardTitle>
              <CardDescription>
                Current pricing for Anthropic&apos;s Claude API models (per million
                tokens)
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
                        Output
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Prompt Caching Write
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Prompt Caching Read
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Context Window
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(claudePricing).map(
                      ([modelName, pricing]) => (
                        <tr key={modelName}>
                          <td className="px-4 py-3">{modelName}</td>
                          <td className="px-4 py-3 text-right">
                            ${pricing.input.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${pricing.output.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${pricing.promptCachingWrite.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ${pricing.promptCachingRead.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {pricing.contextWindow.toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Prices are based on the latest available information. Pricing
                may change over time. All models offer a 50% discount with batch
                processing.
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
              provider: "Anthropic",
              category: modelMetadata.category,
              contextWindow: modelMetadata.contextWindow,
              inputCost: modelMetadata.input,
              outputCost: modelMetadata.output,
            }}
          />
          <ModelCostComparisonChart
            modelName={model}
            modelInputCost={modelMetadata.input}
            modelOutputCost={modelMetadata.output}
            averageInputCost={calculateAverageCosts().averageInputCost}
            averageOutputCost={calculateAverageCosts().averageOutputCost}
          />
        </div>
        <ModelCostCharts data={chartData} />
      </div>
    </motion.div>
  );
}

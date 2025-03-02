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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { geminiPricing } from "@/config/pricing";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type GeminiPricingItem = {
  input: number | Record<string, number>;
  output: number | Record<string, number>;
  contextCaching?: {
    price: number | Record<string, number>;
    storage: number;
  };
  groundingSearch?: {
    freeRequests?: number;
    price: number;
  };
  contextWindow?: number;
  category?: string;
};

export default function GeminiCalculator() {
  const [model, setModel] = useState("gemini-2.0-flash");
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(5000);
  const [inputType, setInputType] = useState("text");
  const [promptSize, setPromptSize] = useState("small");
  const [useContextCaching, setUseContextCaching] = useState(false);
  const [cachingTokens, setCachingTokens] = useState(0);
  const [cachingStorageHours, setCachingStorageHours] = useState(1);
  const [useGroundingSearch, setUseGroundingSearch] = useState(false);
  const [groundingRequests, setGroundingRequests] = useState(0);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("token");

  const calculateCost = () => {
    if (!inputTokens || !outputTokens) {
      toast.error("Missing values", {
        description: "Please enter both input and output tokens",
      });
      return;
    }

    const pricing: GeminiPricingItem =
      geminiPricing[model as keyof typeof geminiPricing];

    // Calculate input cost
    let inputCost = 0;
    if (typeof pricing.input === "number") {
      inputCost = (inputTokens * pricing.input) / 1_000_000;
    } else if (typeof pricing.input === "object") {
      if ("text" in pricing.input) {
        inputCost =
          (inputTokens *
            pricing.input[inputType as keyof typeof pricing.input]) /
          1_000_000;
      } else {
        inputCost =
          (inputTokens *
            pricing.input[promptSize as keyof typeof pricing.input]) /
          1_000_000;
      }
    }

    // Calculate output cost
    let outputCost = 0;
    if (typeof pricing.output === "number") {
      outputCost = (outputTokens * pricing.output) / 1_000_000;
    } else {
      outputCost =
        (outputTokens *
          pricing.output[promptSize as keyof typeof pricing.output]) /
        1_000_000;
    }

    // Calculate context caching cost
    let cachingCost = 0;
    if (
      useContextCaching &&
      "contextCaching" in pricing &&
      pricing.contextCaching
    ) {
      const cachingPrice =
        typeof pricing.contextCaching.price === "number"
          ? pricing.contextCaching.price
          : pricing.contextCaching.price[
              promptSize as keyof typeof pricing.contextCaching.price
            ];
      cachingCost = (cachingTokens * cachingPrice) / 1_000_000;
      cachingCost +=
        (cachingStorageHours * pricing.contextCaching.storage) / 1_000_000;
    }

    // Calculate grounding search cost
    let groundingCost = 0;
    if (
      useGroundingSearch &&
      "groundingSearch" in pricing &&
      pricing.groundingSearch
    ) {
      const freeRequests =
        "freeRequests" in pricing.groundingSearch
          ? pricing.groundingSearch.freeRequests
          : 0;
      const paidRequests = Math.max(0, groundingRequests - freeRequests);
      groundingCost = (paidRequests * pricing.groundingSearch.price) / 1000;
    }

    const total = inputCost + outputCost + cachingCost + groundingCost;

    setCalculatedCost(total);
  };

  const calculateAverageCosts = () => {
    const models = Object.values(geminiPricing);
    const totalInputCost = models.reduce(
      (sum, model) =>
        sum +
        (typeof model.input === "number"
          ? model.input
          : "text" in model.input
          ? model.input.text
          : model.input.small),
      0
    );
    const totalOutputCost = models.reduce(
      (sum, model) =>
        sum +
        (typeof model.output === "number" ? model.output : model.output.small),
      0
    );
    return {
      averageInputCost: totalInputCost / models.length,
      averageOutputCost: totalOutputCost / models.length,
    };
  };

  const modelMetadata = geminiPricing[
    model as keyof typeof geminiPricing
  ] as GeminiPricingItem;
  const chartData = Object.entries(geminiPricing).map(([modelName, data]) => ({
    model: modelName,
    inputCost:
      typeof data.input === "number"
        ? data.input
        : "text" in data.input
        ? data.input.text
        : data.input.small,
    outputCost:
      typeof data.output === "number" ? data.output : data.output.small,
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
                Enter the parameters to calculate the cost
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
                      <SelectItem value="gemini-2.0-flash">
                        Gemini 2.0 Flash
                      </SelectItem>
                      <SelectItem value="gemini-2.0-flash-lite">
                        Gemini 2.0 Flash-Lite
                      </SelectItem>
                      <SelectItem value="gemini-1.5-flash">
                        Gemini 1.5 Flash
                      </SelectItem>
                      <SelectItem value="gemini-1.5-flash-8b">
                        Gemini 1.5 Flash-8B
                      </SelectItem>
                      <SelectItem value="gemini-1.5-pro">
                        Gemini 1.5 Pro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {model === "gemini-2.0-flash" && (
                  <div>
                    <Label htmlFor="input-type">Input Type</Label>
                    <Select
                      value={inputType}
                      onValueChange={setInputType}
                    >
                      <SelectTrigger id="input-type">
                        <SelectValue placeholder="Select input type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(model === "gemini-1.5-flash" ||
                  model === "gemini-1.5-flash-8b" ||
                  model === "gemini-1.5-pro") && (
                  <div>
                    <Label htmlFor="prompt-size">Prompt Size</Label>
                    <Select
                      value={promptSize}
                      onValueChange={setPromptSize}
                    >
                      <SelectTrigger id="prompt-size">
                        <SelectValue placeholder="Select prompt size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">
                          Small (≤ 128k tokens)
                        </SelectItem>
                        <SelectItem value="large">
                          Large (&gt; 128k tokens)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Input Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {typeof geminiPricing[model as keyof typeof geminiPricing]
                        .input === "number"
                        ? (
                            (geminiPricing[model as keyof typeof geminiPricing]
                              .input as number) || 0
                          ).toFixed(3)
                        : (
                            geminiPricing[model as keyof typeof geminiPricing]
                              .input as Record<string, number>
                          )[
                            inputType === "text" ? inputType : promptSize
                          ]!.toFixed(3)}{" "}
                      / 1M tokens
                    </div>
                  </div>
                  <div>
                    <Label>Output Cost</Label>
                    <div className="text-lg font-medium">
                      $
                      {typeof geminiPricing[model as keyof typeof geminiPricing]
                        .output === "number"
                        ? (
                            (geminiPricing[model as keyof typeof geminiPricing]
                              .output as number) || 0
                          ).toFixed(3)
                        : (
                            geminiPricing[model as keyof typeof geminiPricing]
                              .output as Record<string, number>
                          )[promptSize].toFixed(3)}{" "}
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

                {(
                  geminiPricing[
                    model as keyof typeof geminiPricing
                  ] as GeminiPricingItem
                )?.contextCaching && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="context-caching"
                        checked={useContextCaching}
                        onCheckedChange={setUseContextCaching}
                      />
                      <Label
                        htmlFor="context-caching"
                        className="flex items-center cursor-pointer"
                      >
                        Use context caching
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Context caching can reduce costs for repeated
                                prompts
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>

                    {useContextCaching && (
                      <>
                        <div>
                          <Label htmlFor="caching-tokens">
                            Context Caching Tokens
                          </Label>
                          <Input
                            id="caching-tokens"
                            type="number"
                            value={cachingTokens}
                            onChange={(e) =>
                              setCachingTokens(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="caching-storage-hours">
                            Context Caching Storage Hours
                          </Label>
                          <Input
                            id="caching-storage-hours"
                            type="number"
                            value={cachingStorageHours}
                            onChange={(e) =>
                              setCachingStorageHours(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {(
                  geminiPricing[
                    model as keyof typeof geminiPricing
                  ] as GeminiPricingItem
                ).groundingSearch && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="grounding-search"
                        checked={useGroundingSearch}
                        onCheckedChange={setUseGroundingSearch}
                      />
                      <Label
                        htmlFor="grounding-search"
                        className="flex items-center cursor-pointer"
                      >
                        Use grounding with Google Search
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Grounding with Google Search can improve
                                response accuracy
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                    </div>

                    {useGroundingSearch && (
                      <div>
                        <Label htmlFor="grounding-requests">
                          Number of Grounding Requests
                        </Label>
                        <Input
                          id="grounding-requests"
                          type="number"
                          value={groundingRequests}
                          onChange={(e) =>
                            setGroundingRequests(
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </div>
                    )}
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
                          (typeof (
                            geminiPricing[
                              model as keyof typeof geminiPricing
                            ] as GeminiPricingItem
                          ).input === "number"
                            ? (
                                geminiPricing[
                                  model as keyof typeof geminiPricing
                                ] as GeminiPricingItem
                              ).input
                            : (
                                geminiPricing[
                                  model as keyof typeof geminiPricing
                                ] as GeminiPricingItem
                              ).input[
                                inputType === "text" ? inputType : promptSize
                              ])) /
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
                          ((typeof geminiPricing[
                            model as keyof typeof geminiPricing
                          ].output === "number"
                            ? geminiPricing[model as keyof typeof geminiPricing]
                                .output
                            : (
                                geminiPricing[
                                  model as keyof typeof geminiPricing
                                ].output as Record<string, number>
                              )[promptSize]) as number)) /
                        1_000_000
                      ).toFixed(6)}
                    </div>
                  </div>
                  {useContextCaching && (
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Context Caching Cost
                      </div>
                      <div className="font-medium">
                        $
                        {(
                          (cachingTokens *
                            (typeof (
                              geminiPricing[
                                model as keyof typeof geminiPricing
                              ] as GeminiPricingItem
                            ).contextCaching?.price === "number"
                              ? ((
                                  geminiPricing[
                                    model as keyof typeof geminiPricing
                                  ] as GeminiPricingItem
                                ).contextCaching?.price as number) ?? 0
                              : (
                                  (
                                    geminiPricing[
                                      model as keyof typeof geminiPricing
                                    ] as GeminiPricingItem
                                  ).contextCaching?.price as
                                    | Record<string, number>
                                    | undefined
                                )?.[promptSize] ?? 0)) /
                            1_000_000 +
                          (cachingStorageHours *
                            (((
                              geminiPricing[
                                model as keyof typeof geminiPricing
                              ] as GeminiPricingItem
                            ).contextCaching?.storage as number) ?? 0)) /
                            1_000_000
                        ).toFixed(6)}
                      </div>
                    </div>
                  )}
                  {useGroundingSearch && (
                    <div className="border rounded-md p-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Grounding Search Cost
                      </div>
                      <div className="font-medium">
                        $
                        {(
                          (Math.max(
                            0,
                            groundingRequests -
                              ((
                                geminiPricing[
                                  model as keyof typeof geminiPricing
                                ] as GeminiPricingItem
                              ).groundingSearch?.freeRequests || 0)
                          ) *
                            Number(
                              (
                                geminiPricing[
                                  model as keyof typeof geminiPricing
                                ] as GeminiPricingItem
                              ).groundingSearch?.price ?? 0
                            )) /
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
              <CardTitle>Gemini Model Pricing</CardTitle>
              <CardDescription>
                Current pricing for Google&apos;s Gemini API models (per million
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
                        Output
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Context Caching
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Context Window
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(geminiPricing).map(
                      (
                        [modelName, pricing]: [string, GeminiPricingItem],
                        index
                      ) => (
                        <tr key={`${modelName}-${index}`}>
                          <td className="px-4 py-3">{modelName}</td>
                          <td className="px-4 py-3 text-right">
                            {typeof pricing.input === "number"
                              ? `$${pricing.input.toFixed(3)}`
                              : Object.entries(pricing.input)
                                  .map(
                                    ([key, value]) =>
                                      `${key}: $${value.toFixed(3)}`
                                  )
                                  .join(", ")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {typeof pricing.output === "number"
                              ? `$${pricing.output.toFixed(3)}`
                              : Object.entries(pricing.output)
                                  .map(
                                    ([key, value]) =>
                                      `${key}: $${value.toFixed(3)}`
                                  )
                                  .join(", ")}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {pricing.contextCaching
                              ? `$${
                                  typeof pricing.contextCaching.price ===
                                  "number"
                                    ? pricing.contextCaching.price.toFixed(3)
                                    : Object.entries(
                                        pricing.contextCaching.price
                                      )
                                        .map(
                                          ([key, value]) =>
                                            `${key}: $${value.toFixed(3)}`
                                        )
                                        .join(", ")
                                } / Storage: $${pricing.contextCaching.storage.toFixed(
                                  2
                                )} per hour`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {pricing.contextWindow?.toLocaleString() || "N/A"}
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
              provider: "Google",
              category: modelMetadata.category,
              contextWindow: modelMetadata.contextWindow,
              inputCost:
                typeof modelMetadata.input === "number"
                  ? modelMetadata.input
                  : "text" in modelMetadata.input
                  ? modelMetadata.input.text
                  : modelMetadata.input.small,
              outputCost:
                typeof modelMetadata.output === "number"
                  ? modelMetadata.output
                  : modelMetadata.output.small,
            }}
          />
          <ModelCostComparisonChart
            modelName={model}
            modelInputCost={
              typeof modelMetadata.input === "number"
                ? modelMetadata.input
                : "text" in modelMetadata.input
                ? modelMetadata.input.text
                : modelMetadata.input.small
            }
            modelOutputCost={
              typeof modelMetadata.output === "number"
                ? modelMetadata.output
                : modelMetadata.output.small
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

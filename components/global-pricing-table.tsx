"use client";

import { ContextCharts, CostCharts } from "@/components/pricing-charts";
import { Badge } from "@/components/ui/badge";
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
import {
  PRICING_LAST_UPDATED,
} from "@/config/pricing";
import { getAllModels, getUniqueCategories, getUniqueProviders } from '@/lib/models';
import { useState } from "react";

const providerColors: { [key: string]: string } = {
  OpenAI: "bg-green-500/50",
  Cohere: "bg-purple-500/50",
  Google: "bg-blue-500/50",
  Anthropic: "bg-yellow-500/50",
  "Perplexity.ai": "bg-red-500/50",
};

const ProviderBadge = ({ provider }: { provider: string }) => {
  const bgColor = providerColors[provider] || "bg-gray-500";
  return (
    <Badge
      className={`${bgColor} text-white`}
      variant="secondary"
    >
      {provider}
    </Badge>
  );
};

export default function GlobalPricingTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [provider, setProvider] = useState("all");
  const [category, setCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("text");

  const allData = getAllModels();
  const providers = ["all", ...getUniqueProviders()];
  const categories = ["all", ...getUniqueCategories()];

  interface ModelData {
    model: string;
    provider: string;
    category: string;
    [key: string]: string | number | Record<string, number> | undefined; // for other properties that vary by model type
  }

  const filterData = (data: ModelData[]) => {
    return data.filter((item) => {
      const matchesSearch = item.model
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesProvider = provider === "all" || item.provider === provider;
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesProvider && matchesCategory;
    });
  };

  const filteredTextModels = filterData(allData.textModels);
  const filteredImageModels = filterData(allData.imageModels);
  const filteredEmbeddingModels = filterData(allData.embeddingModels);
  const filteredAudioModels = filterData(allData.audioModels);

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle>Comprehensive AI Model Pricing Comparison</CardTitle>
        <CardDescription>
          Compare pricing across all AI models and providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="provider">Provider</Label>
              <Select
                value={provider}
                onValueChange={setProvider}
              >
                <SelectTrigger
                  id="provider"
                  className="w-[180px]"
                >
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem
                      key={p}
                      value={p}
                    >
                      {p === "all" ? "All Providers" : p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger
                  id="category"
                  className="w-[180px]"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem
                      key={c}
                      value={c}
                    >
                      {c === "all" ? "All Categories" : c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-6">
              <TabsTrigger value="text">Text Generation</TabsTrigger>
              <TabsTrigger value="image">Image Generation</TabsTrigger>
              <TabsTrigger value="embedding">Embeddings</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="cost-charts">Cost Charts</TabsTrigger>
              <TabsTrigger value="context-charts">Context Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <div className="border border-border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Input Cost
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Output Cost
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Provider
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTextModels.length > 0 ? (
                      filteredTextModels.map((model, index) => (
                        <tr key={`${model.model}-${index}`}>
                          <td className="px-4 py-3">{model.model}</td>
                          <td className="px-4 py-3 text-right">
                            {typeof model.inputCost === "number"
                              ? `$${model.inputCost.toFixed(3)}`
                              : model.inputCost
                              ? Object.entries(model.inputCost)
                                  .map(
                                    ([key, value]) =>
                                      `${key}: $${(value as number).toFixed(3)}`
                                  )
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {typeof model.outputCost === "number"
                              ? `$${model.outputCost.toFixed(3)}`
                              : model.outputCost
                              ? Object.entries(model.outputCost)
                                  .map(
                                    ([key, value]) =>
                                      `${key}: $${(value as number).toFixed(3)}`
                                  )
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ProviderBadge provider={model.provider} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-center text-muted-foreground"
                        >
                          No models match your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="image">
              <div className="border border-border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right font-medium">Unit</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Provider
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredImageModels.length > 0 ? (
                      filteredImageModels.map((model, index) => (
                        <tr key={`${model.model}-${index}`}>
                          <td className="px-4 py-3">{model.model}</td>
                          <td className="px-4 py-3 text-right">
                            {typeof model.price === "number"
                              ? `$${model.price.toFixed(3)}`
                              : model.price?.toString() || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {typeof model.unit === "object"
                              ? JSON.stringify(model.unit)
                              : String(model.unit)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ProviderBadge provider={model.provider} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-center text-muted-foreground"
                        >
                          No models match your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="embedding">
              <div className="border border-border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Context
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        Provider
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredEmbeddingModels.length > 0 ? (
                      filteredEmbeddingModels.map((model, index) => (
                        <tr key={`${model.model}-${index}`}>
                          <td className="px-4 py-3">{model.model}</td>
                          <td className="px-4 py-3 text-right">
                            $
                            {typeof model.price === "number"
                              ? model.price.toFixed(2)
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {typeof model.context === "object"
                              ? JSON.stringify(model.context)
                              : String(model.context)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ProviderBadge provider={model.provider} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-center text-muted-foreground"
                        >
                          No models match your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="audio">
              <div className="border border-border rounded-md overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right font-medium">Unit</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Provider
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredAudioModels.length > 0 ? (
                      filteredAudioModels.map((model, index) => (
                        <tr key={`${model.model}-${index}`}>
                          <td className="px-4 py-3">{model.model}</td>
                          <td className="px-4 py-3 text-right">
                            $
                            {typeof model.price === "number"
                              ? model.price.toFixed(3)
                              : String(model.price)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {typeof model.unit === "object"
                              ? JSON.stringify(model.unit)
                              : String(model.unit)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ProviderBadge provider={model.provider} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-3 text-center text-muted-foreground"
                        >
                          No models match your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="cost-charts">
              <CostCharts
                searchTerm={searchTerm}
                provider={provider}
                category={category}
              />
            </TabsContent>

            <TabsContent value="context-charts">
              <ContextCharts
                searchTerm={searchTerm}
                provider={provider}
                category={category}
              />
            </TabsContent>
          </Tabs>
          <div className="flex justify-between w-full text-sm text-muted-foreground mt-4">
            <p>
              Prices are based on the latest available information. Pricing may
              change over time.
            </p>
            <p>Last updated: {PRICING_LAST_UPDATED}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { GlobalPricingTable };

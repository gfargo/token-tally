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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProviderStats, ProviderSummary } from "@/lib/provider-summary";
import { formatLargeNumber } from "@/lib/utils";
import {
  getCalculatorUrl,
  getProviderDetailUrl,
} from "@/utils/providerUtils";
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  Gauge,
  MessageSquare,
  Rows3,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ProviderDataEntry = {
  summary: ProviderSummary;
  stats: ProviderStats;
};

export type ProviderPreset = {
  label: string;
  providers: [string, string];
};

type ProviderComparisonProps = {
  providerOptions: string[];
  providerData: Record<string, ProviderDataEntry>;
  presets?: ProviderPreset[];
};

const formatCurrency = (value: number) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: value < 1 ? 3 : 2,
    maximumFractionDigits: value < 1 ? 3 : 2,
  })}`;

const TextModelCard = ({
  model,
}: {
  model: ProviderSummary["textModels"][number];
}) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle className="text-base flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        {model.model}
      </CardTitle>
      <CardDescription>{model.category}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <DollarSign className="h-3 w-3 text-muted-foreground" />
        <span>
          Input:{" "}
          {typeof model.inputCost === "number"
            ? formatCurrency(model.inputCost)
            : "Varies"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign className="h-3 w-3 text-muted-foreground" />
        <span>
          Output:{" "}
          {typeof model.outputCost === "number"
            ? formatCurrency(model.outputCost)
            : "Varies"}
        </span>
      </div>
      {model.contextWindow && (
        <div className="flex items-center gap-2">
          <Gauge className="h-3 w-3 text-muted-foreground" />
          <span>Context: {model.contextWindow.toLocaleString()} tokens</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const TokenEfficiencyChart = ({
  provider,
  models,
}: {
  provider: string;
  models: ProviderSummary["textModels"];
}) => {
  const data = useMemo(() => {
    return models
      .filter(
        (model) =>
          typeof model.inputCost === "number" &&
          (model.inputCost as number) > 0
      )
      .map((model) => ({
        name: model.model,
        tokensPerDollar: Math.round(
          1_000_000 / (model.inputCost as number)
        ),
      }))
      .sort((a, b) => b.tokensPerDollar - a.tokensPerDollar)
      .slice(0, 5);
  }, [models]);

  if (data.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Star className="h-4 w-4" />
          Token efficiency
        </CardTitle>
        <CardDescription>
          Tokens per $1 (higher bars = cheaper inference) for{" "}
          {provider}&apos;s top models
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={260}
        >
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(value) => formatLargeNumber(value as number)}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={140}
            />
            <Tooltip
              formatter={(value) =>
                `${formatLargeNumber(value as number)} tokens`
              }
            />
            <Bar
              dataKey="tokensPerDollar"
              fill="#38bdf8"
              name="Tokens per $1"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ProviderComparisonColumn = ({
  provider,
  data,
}: {
  provider: string;
  data: ProviderDataEntry;
}) => {
  const { summary, stats } = data;
  const topTextModels = useMemo(() => {
    return [...summary.textModels]
      .sort((a, b) => {
        const aInput =
          typeof a.inputCost === "number" ? a.inputCost : Number.POSITIVE_INFINITY;
        const bInput =
          typeof b.inputCost === "number" ? b.inputCost : Number.POSITIVE_INFINITY;
        return aInput - bInput;
      })
      .slice(0, 3);
  }, [summary.textModels]);

  const curatedHighlights = summary.curatedEntries.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{provider}</h2>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href={getProviderDetailUrl(provider)}
            className="underline text-muted-foreground flex items-center gap-1"
          >
            View overview <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href={getCalculatorUrl(provider)}
            className="underline text-muted-foreground flex items-center gap-1"
          >
            Calculator <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Highlights
          </CardTitle>
          <CardDescription>
            Quick stats for pricing and marketplace availability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Text models: {stats.textModelCount}</p>
          {stats.minInputCost && (
            <p>
              Lowest input: {formatCurrency(stats.minInputCost.value)} (
              {stats.minInputCost.model})
            </p>
          )}
          {stats.minOutputCost && (
            <p>
              Lowest output: {formatCurrency(stats.minOutputCost.value)} (
              {stats.minOutputCost.model})
            </p>
          )}
          {stats.maxContextWindow && (
            <p>
              Max context: {stats.maxContextWindow.value.toLocaleString()} tokens (
              {stats.maxContextWindow.model})
            </p>
          )}
          <p>Curated offerings: {stats.curatedEntryCount}</p>
          {stats.curatedEntryCount > 0 && (
            <>
              <p>
                Subscription plans: {stats.modeCounts.subscription} · Credit bundles:{" "}
                {stats.modeCounts.credit}
              </p>
              <p>
                Token listings: {stats.modeCounts.token} · Compute:{" "}
                {stats.modeCounts.compute} · Range quotes: {stats.modeCounts.range}
              </p>
              {stats.vendors.length > 0 && (
                <p>Vendors: {stats.vendors.join(", ")}</p>
              )}
            </>
          )}
          {stats.bestTokenEfficiency && (
            <p>
              Best tokens/$1:{" "}
              {formatLargeNumber(stats.bestTokenEfficiency.tokensPerDollar)} tokens (
              {stats.bestTokenEfficiency.model})
            </p>
          )}
        </CardContent>
      </Card>

      {summary.textModels.length > 0 && (
        <TokenEfficiencyChart
          provider={provider}
          models={summary.textModels}
        />
      )}

      {topTextModels.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Rows3 className="h-5 w-5" />
            Top text models
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {topTextModels.map((model) => (
              <TextModelCard key={model.model} model={model} />
            ))}
          </div>
        </section>
      )}

      {curatedHighlights.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Curated marketplace picks
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {curatedHighlights.map((entry) => (
              <Card
                key={`${entry.providerKey}-${entry.modelId}`}
                className="flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{entry.name}</CardTitle>
                      <CardDescription>{entry.category}</CardDescription>
                    </div>
                    <Badge variant="secondary">{entry.provider}</Badge>
                  </div>
                  {entry.vendor ? (
                    <p className="text-xs text-muted-foreground">
                      Vendor: {entry.vendor}
                    </p>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {entry.modes.map((mode, index) => (
                    <AdditionalModeSummary
                      key={`${entry.modelId}-mode-${index}`}
                      mode={mode}
                    />
                  ))}
                  {entry.catalogUrl ? (
                    <a
                      href={entry.catalogUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline text-muted-foreground"
                    >
                      View catalog
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export const ProviderComparison = ({
  providerOptions,
  providerData,
  presets = [],
}: ProviderComparisonProps) => {
  const defaultLeft = providerOptions[0] ?? "";
  const defaultRight =
    providerOptions[1] ?? providerOptions[0] ?? "";

  const [leftProvider, setLeftProvider] = useState(defaultLeft);
  const [rightProvider, setRightProvider] = useState(defaultRight);
  const [selectedPreset, setSelectedPreset] = useState<string>("");

  const leftData = providerData[leftProvider];
  const rightData = providerData[rightProvider];

  const availablePresets = useMemo(
    () =>
      presets.filter((preset) =>
        preset.providers.every((provider) =>
          providerOptions.includes(provider)
        )
      ),
    [presets, providerOptions]
  );

  const handlePresetChange = (label: string) => {
    setSelectedPreset(label);
    const preset = availablePresets.find((item) => item.label === label);
    if (preset) {
      const [first, second] = preset.providers;
      setLeftProvider(first);
      setRightProvider(second);
    }
  };

  const handleLeftChange = (provider: string) => {
    setSelectedPreset("");
    setLeftProvider(provider);
  };

  const handleRightChange = (provider: string) => {
    setSelectedPreset("");
    setRightProvider(provider);
  };

  return (
    <div className="space-y-8">
      {availablePresets.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="preset-select">Saved comparisons</Label>
          <Select
            value={selectedPreset}
            onValueChange={handlePresetChange}
          >
            <SelectTrigger id="preset-select">
              <SelectValue placeholder="Pick a preset pair" />
            </SelectTrigger>
            <SelectContent>
              {availablePresets.map((preset) => (
                <SelectItem
                  key={preset.label}
                  value={preset.label}
                >
                  {preset.label} ({preset.providers.join(" vs ")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="provider-a">Provider A</Label>
          <Select
            value={leftProvider}
            onValueChange={handleLeftChange}
          >
            <SelectTrigger id="provider-a">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {providerOptions.map((provider) => (
                <SelectItem
                  key={`left-${provider}`}
                  value={provider}
                >
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="provider-b">Provider B</Label>
          <Select
            value={rightProvider}
            onValueChange={handleRightChange}
          >
            <SelectTrigger id="provider-b">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {providerOptions.map((provider) => (
                <SelectItem
                  key={`right-${provider}`}
                  value={provider}
                >
                  {provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leftData ? (
          <ProviderComparisonColumn
            provider={leftProvider}
            data={leftData}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Select a provider</CardTitle>
              <CardDescription>
                Choose a provider to populate the comparison column.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {rightData ? (
          <ProviderComparisonColumn
            provider={rightProvider}
            data={rightData}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Select a provider</CardTitle>
              <CardDescription>
                Choose a provider to populate the comparison column.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

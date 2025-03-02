"use client";

import { ModelCostCharts } from "@/components/model-cost-charts";
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
import { audioPricing } from "@/config/pricing";
import { motion } from "framer-motion";

import { useState } from "react";
import { toast } from "sonner";

const chartData = Object.entries(audioPricing).map(([modelName, data]) => ({
  model: modelName,
  inputCost: data.price,
  outputCost: data.price,
}));

export default function AudioCalculator() {
  const [model, setModel] = useState("whisper");
  const [amount, setAmount] = useState(10);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");

  const calculateCost = () => {
    if (!amount || amount < 1) {
      toast.error("Invalid input", {
        description: "Please enter a positive number",
      });
      return;
    }

    const pricing = audioPricing[model as keyof typeof audioPricing];
    const total = amount * pricing.price;

    setCalculatedCost(total);
  };

  const getUnitLabel = () => {
    const pricing = audioPricing[model as keyof typeof audioPricing];
    if (pricing.unit === "per minute") {
      return "Minutes";
    } else if (pricing.unit === "per 1K characters") {
      return "Thousands of Characters";
    }
    return "Units";
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
          <TabsTrigger value="calculator">Audio Calculator</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Table</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Audio Processing Cost Calculator</CardTitle>
              <CardDescription>
                Enter the amount to calculate the cost
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
                      <SelectItem value="whisper">
                        Whisper (Transcription)
                      </SelectItem>
                      <SelectItem value="tts-1">TTS-1 (Standard)</SelectItem>
                      <SelectItem value="tts-1-hd">
                        TTS-1-HD (High Quality)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Label>Cost</Label>
                  <div className="text-lg font-medium">
                    $
                    {audioPricing[
                      model as keyof typeof audioPricing
                    ].price.toFixed(3)}{" "}
                    {audioPricing[model as keyof typeof audioPricing].unit}
                  </div>
                </div>

                <div>
                  <Label htmlFor="amount">{getUnitLabel()}</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) =>
                      setAmount(Number.parseInt(e.target.value) || 0)
                    }
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {model === "whisper"
                      ? "Enter the number of minutes of audio to transcribe"
                      : "Enter the number of thousands of characters to convert to speech"}
                  </p>
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
                    ${calculatedCost.toFixed(4)}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Estimated cost for {amount} {getUnitLabel().toLowerCase()}
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
                        Amount
                      </div>
                      <div className="font-medium">
                        {amount} {getUnitLabel().toLowerCase()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rate</div>
                      <div className="font-medium">
                        $
                        {audioPricing[
                          model as keyof typeof audioPricing
                        ].price.toFixed(3)}{" "}
                        {audioPricing[model as keyof typeof audioPricing].unit}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Audio Models Pricing</CardTitle>
              <CardDescription>
                Current pricing for OpenAI's audio processing models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Model</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right font-medium">Unit</th>
                      <th className="px-4 py-3 text-right font-medium">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {Object.entries(audioPricing).map(([modelName, data]) => (
                      <tr key={modelName}>
                        <td className="px-4 py-3">{modelName}</td>
                        <td className="px-4 py-3 text-right">
                          ${data.price.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-right">{data.unit}</td>
                        <td className="px-4 py-3 text-right">
                          {data.category}
                        </td>
                      </tr>
                    ))}
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
        <ModelMetadataCard
          metadata={{
            name: model,
            provider: "OpenAI",
            category: audioPricing[model as keyof typeof audioPricing].category,
            inputCost: audioPricing[model as keyof typeof audioPricing].price,
            outputCost: audioPricing[model as keyof typeof audioPricing].price,
          }}
        />
        <ModelCostCharts data={chartData} />
      </div>
    </motion.div>
  );
}

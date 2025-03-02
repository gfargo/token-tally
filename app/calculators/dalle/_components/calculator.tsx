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
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const modelPricing = {
  "dall-e-3": {
    "1024x1024": 0.04,
    "1024x1792": 0.08,
    "1792x1024": 0.08,
  },
  "dall-e-2": {
    "1024x1024": 0.02,
    "512x512": 0.018,
    "256x256": 0.016,
  },
};

const chartData = Object.entries(modelPricing).flatMap(([modelName, sizes]) =>
  Object.entries(sizes).map(([sizeName, price]) => ({
    model: `${modelName} (${sizeName})`,
    inputCost: price,
    outputCost: price,
  }))
);

export default function DalleCalculator() {
  const [model, setModel] = useState("dall-e-3");
  const [size, setSize] = useState("1024x1024");
  const [quantity, setQuantity] = useState(1);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("generation");

  const calculateCost = () => {
    if (!quantity || quantity < 1) {
      toast.error("Invalid quantity", {
        description: "Please enter a positive number of images",
      });
      return;
    }

    const pricing = modelPricing[model as keyof typeof modelPricing];
    const costPerImage = pricing[size as keyof typeof pricing];
    const total = costPerImage * quantity;

    setCalculatedCost(total);
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
          <TabsTrigger value="generation">Image Generation</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Table</TabsTrigger>
        </TabsList>

        <TabsContent value="generation">
          <Card>
            <CardHeader>
              <CardTitle>Image Generation Cost Calculator</CardTitle>
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
                    onValueChange={(value) => {
                      setModel(value);
                      // Reset size when model changes
                      if (value === "dall-e-2") {
                        setSize("1024x1024");
                      } else {
                        setSize("1024x1024");
                      }
                    }}
                  >
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                      <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">Select Size</Label>
                  <Select
                    value={size}
                    onValueChange={setSize}
                  >
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {model === "dall-e-3" ? (
                        <>
                          <SelectItem value="1024x1024">
                            1024x1024 (Square)
                          </SelectItem>
                          <SelectItem value="1024x1792">
                            1024x1792 (Portrait)
                          </SelectItem>
                          <SelectItem value="1792x1024">
                            1792x1024 (Landscape)
                          </SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="1024x1024">1024x1024</SelectItem>
                          <SelectItem value="512x512">512x512</SelectItem>
                          <SelectItem value="256x256">256x256</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Number of Images</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Number.parseInt(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="pt-2">
                  <Label>Cost Per Image</Label>
                  <div className="text-lg font-medium">
                    $
                    {modelPricing[model as keyof typeof modelPricing][
                      size as keyof (typeof modelPricing)[keyof typeof modelPricing]
                    ].toFixed(3)}
                  </div>
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
                    ${calculatedCost.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Estimated cost for {quantity} image{quantity > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="mt-4 border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Model</div>
                      <div className="font-medium">{model}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Size</div>
                      <div className="font-medium">{size}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Quantity
                      </div>
                      <div className="font-medium">{quantity}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Cost Per Image
                      </div>
                      <div className="font-medium">
                        $
                        {modelPricing[model as keyof typeof modelPricing][
                          size as keyof (typeof modelPricing)[keyof typeof modelPricing]
                        ].toFixed(3)}
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
              <CardTitle>DALL-E Pricing</CardTitle>
              <CardDescription>
                Current pricing for OpenAI's DALL-E image generation models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">DALL-E 3</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">
                            Size
                          </th>
                          <th className="px-4 py-3 text-right font-medium">
                            Price per image
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-3">1024x1024 (Square)</td>
                          <td className="px-4 py-3 text-right">$0.04</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">1024x1792 (Portrait)</td>
                          <td className="px-4 py-3 text-right">$0.08</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">1792x1024 (Landscape)</td>
                          <td className="px-4 py-3 text-right">$0.08</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">DALL-E 2</h3>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">
                            Size
                          </th>
                          <th className="px-4 py-3 text-right font-medium">
                            Price per image
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="px-4 py-3">1024x1024</td>
                          <td className="px-4 py-3 text-right">$0.02</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">512x512</td>
                          <td className="px-4 py-3 text-right">$0.018</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3">256x256</td>
                          <td className="px-4 py-3 text-right">$0.016</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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
            name: `${model} (${size})`,
            provider: "OpenAI",
            category: "Image Generation",
            inputCost:
              modelPricing[model as keyof typeof modelPricing][
                size as keyof (typeof modelPricing)[keyof typeof modelPricing]
              ],
            outputCost:
              modelPricing[model as keyof typeof modelPricing][
                size as keyof (typeof modelPricing)[keyof typeof modelPricing]
              ],
          }}
        />
        <ModelCostCharts data={chartData} />
      </div>
    </motion.div>
  );
}

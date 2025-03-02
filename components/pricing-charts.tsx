import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BaseTextModel,
  filterModels,
  getAllModels,
  getTopModels,
} from "@/lib/models";
import { formatLargeNumber } from "@/lib/utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

interface ChartProps {
  searchTerm: string;
  provider: string;
  category: string;
}

export function CostCharts({ searchTerm, provider, category }: ChartProps) {
  const allModels = getAllModels();
  const textModels = filterModels(
    allModels.textModels,
    searchTerm,
    provider,
    category
  );

  const topInputCostModels = getTopModels(textModels, "inputCost");
  const topOutputCostModels = getTopModels(textModels, "outputCost");

  const inputCostData = topInputCostModels.map((model) => ({
    name: model.model,
    cost: (model as BaseTextModel).inputCost,
  }));

  const outputCostData = topOutputCostModels.map((model) => ({
    name: model.model,
    cost: (model as BaseTextModel).outputCost,
  }));

  const costComparisonData = textModels
    .filter(
      (model) =>
        typeof (model as BaseTextModel).inputCost === "number" &&
        typeof (model as BaseTextModel).outputCost === "number"
    )
    .map((model) => ({
      name: model.model,
      inputCost: (model as BaseTextModel).inputCost,
      outputCost: (model as BaseTextModel).outputCost,
    }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Models by Input Cost</CardTitle>
          <CardDescription>
            Comparison of input costs per million tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <BarChart
              data={inputCostData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />
              <XAxis
                type="number"
                stroke="#ccc"
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                stroke="#ccc"
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
              />
              <Legend />
              <Bar
                dataKey="cost"
                fill="#FFCD6F"
                name="Cost per Million Tokens ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Models by Output Cost</CardTitle>
          <CardDescription>
            Comparison of output costs per million tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <BarChart
              data={outputCostData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />
              <XAxis
                type="number"
                stroke="#ccc"
              />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                stroke="#ccc"
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
              />
              <Legend />
              <Bar
                dataKey="cost"
                fill="#FFCD6F"
                name="Cost per Million Tokens ($)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input vs Output Cost Comparison</CardTitle>
          <CardDescription>
            Scatter plot comparing input and output costs across models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />
              <XAxis
                type="number"
                dataKey="inputCost"
                name="Input Cost"
                stroke="#ccc"
                label={{
                  value: "Input Cost ($)",
                  position: "bottom",
                  fill: "#ccc",
                }}
              />
              <YAxis
                type="number"
                dataKey="outputCost"
                name="Output Cost"
                stroke="#ccc"
                label={{
                  value: "Output Cost ($)",
                  angle: -90,
                  position: "left",
                  fill: "#ccc",
                }}
              />
              <ZAxis
                type="category"
                dataKey="name"
                name="Model"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                formatter={(value: number | string) => {
                  if (typeof value === "number" && !isNaN(value)) {
                    return `$${value.toFixed(3)}`;
                  }
                  return "N/A";
                }}
              />
              <Legend />
              <Scatter
                name="Models"
                data={costComparisonData}
                fill="#FFCD6F"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function ContextCharts({ searchTerm, provider, category }: ChartProps) {
  const allModels = getAllModels();
  const textModels = filterModels(
    allModels.textModels,
    searchTerm,
    provider,
    category
  );

  const modelsWithContextWindow = textModels.filter(
    (model: BaseTextModel) => model?.contextWindow !== undefined
  );

  const contextWindowData = modelsWithContextWindow.map(
    (model: BaseTextModel) => ({
      name: model.model,
      contextWindow: model.contextWindow,
      inputCost: model?.inputCost,
      outputCost: model?.outputCost,
    })
  );

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Context Window Size Comparison</CardTitle>
          <CardDescription>
            Comparison of context window sizes across models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <BarChart
              data={contextWindowData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />
              <XAxis
                dataKey="name"
                stroke="#ccc"
              />
              <YAxis
                stroke="#ccc"
                tickFormatter={formatLargeNumber}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                formatter={(value: number) => formatLargeNumber(value)}
              />
              <Legend />
              <Bar
                dataKey="contextWindow"
                fill="#FFCD6F"
                name="Context Window Size (tokens)"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Context Window Size vs Input Cost</CardTitle>
          <CardDescription>
            Scatter plot comparing context window sizes and input costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width="100%"
            height={400}
          >
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#333"
              />
              <XAxis
                type="number"
                dataKey="contextWindow"
                name="Context Window"
                stroke="#ccc"
                label={{
                  value: "Context Window Size (tokens)",
                  position: "bottom",
                  fill: "#ccc",
                }}
                tickFormatter={formatLargeNumber}
              />
              <YAxis
                type="number"
                dataKey="inputCost"
                name="Input Cost"
                stroke="#ccc"
                label={{
                  value: "Input Cost ($)",
                  angle: -90,
                  position: "left",
                  fill: "#ccc",
                }}
              />
              <ZAxis
                type="category"
                dataKey="name"
                name="Model"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                formatter={(value: number | string, name: string) => {
                  if (name === "Context Window") {
                    return [formatLargeNumber(Number(value)), name];
                  }
                  if (typeof value === "number" && !isNaN(value)) {
                    return [`$${value.toFixed(3)}`, name];
                  }
                  return ["N/A", name];
                }}
              />
              <Legend />
              <Scatter
                name="Models"
                data={contextWindowData}
                fill="#FFCD6F"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

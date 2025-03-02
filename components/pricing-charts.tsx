import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllModels } from "@/config/pricing"

const getTopModels = (models: any[], metric: string, limit = 10) => {
  return models
    .filter((model) => typeof model[metric] === "number" && !isNaN(model[metric]))
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, limit)
}

const formatLargeNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

interface ChartProps {
  searchTerm: string
  provider: string
  category: string
}

const filterModels = (models: any[], searchTerm: string, provider: string, category: string) => {
  return models.filter(
    (model) =>
      model.model.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (provider === "all" || model.provider === provider) &&
      (category === "all" || model.category === category),
  )
}

export function CostCharts({ searchTerm, provider, category }: ChartProps) {
  const allModels = getAllModels()
  const textModels = filterModels(allModels.textModels, searchTerm, provider, category)

  const topInputCostModels = getTopModels(textModels, "inputCost")
  const topOutputCostModels = getTopModels(textModels, "outputCost")

  const inputCostData = topInputCostModels.map((model) => ({
    name: model.model,
    cost: model.inputCost,
  }))

  const outputCostData = topOutputCostModels.map((model) => ({
    name: model.model,
    cost: model.outputCost,
  }))

  const costComparisonData = textModels
    .filter((model) => typeof model.inputCost === "number" && typeof model.outputCost === "number")
    .map((model) => ({
      name: model.model,
      inputCost: model.inputCost,
      outputCost: model.outputCost,
    }))

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Models by Input Cost</CardTitle>
          <CardDescription>Comparison of input costs per million tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={inputCostData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#ccc" />
              <YAxis dataKey="name" type="category" width={150} stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
              <Legend />
              <Bar dataKey="cost" fill="#FFCD6F" name="Cost per Million Tokens ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 Models by Output Cost</CardTitle>
          <CardDescription>Comparison of output costs per million tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={outputCostData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#ccc" />
              <YAxis dataKey="name" type="category" width={150} stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: "#333", border: "none" }} />
              <Legend />
              <Bar dataKey="cost" fill="#FFCD6F" name="Cost per Million Tokens ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Input vs Output Cost Comparison</CardTitle>
          <CardDescription>Scatter plot comparing input and output costs across models</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                type="number"
                dataKey="inputCost"
                name="Input Cost"
                stroke="#ccc"
                label={{ value: "Input Cost ($)", position: "bottom", fill: "#ccc" }}
              />
              <YAxis
                type="number"
                dataKey="outputCost"
                name="Output Cost"
                stroke="#ccc"
                label={{ value: "Output Cost ($)", angle: -90, position: "left", fill: "#ccc" }}
              />
              <ZAxis type="category" dataKey="name" name="Model" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                formatter={(value: any) => {
                  if (typeof value === "number" && !isNaN(value)) {
                    return `$${value.toFixed(3)}`
                  }
                  return "N/A"
                }}
              />
              <Legend />
              <Scatter name="Models" data={costComparisonData} fill="#FFCD6F" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export function ContextCharts({ searchTerm, provider, category }: ChartProps) {
  const allModels = getAllModels()
  const textModels = filterModels(allModels.textModels, searchTerm, provider, category)

  const modelsWithContextWindow = textModels.filter((model) => model.contextWindow !== undefined)

  const contextWindowData = modelsWithContextWindow.map((model) => ({
    name: model.model,
    contextWindow: model.contextWindow,
    inputCost: model.inputCost,
    outputCost: model.outputCost,
  }))

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Context Window Size Comparison</CardTitle>
          <CardDescription>Comparison of context window sizes across models</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={contextWindowData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" tickFormatter={formatLargeNumber} />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                formatter={(value: number) => formatLargeNumber(value)}
              />
              <Legend />
              <Bar dataKey="contextWindow" fill="#FFCD6F" name="Context Window Size (tokens)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Context Window Size vs Input Cost</CardTitle>
          <CardDescription>Scatter plot comparing context window sizes and input costs</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                type="number"
                dataKey="contextWindow"
                name="Context Window"
                stroke="#ccc"
                label={{ value: "Context Window Size (tokens)", position: "bottom", fill: "#ccc" }}
                tickFormatter={formatLargeNumber}
              />
              <YAxis
                type="number"
                dataKey="inputCost"
                name="Input Cost"
                stroke="#ccc"
                label={{ value: "Input Cost ($)", angle: -90, position: "left", fill: "#ccc" }}
              />
              <ZAxis type="category" dataKey="name" name="Model" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{ backgroundColor: "#333", border: "none" }}
                formatter={(value: any, name: string) => {
                  if (name === "Context Window") {
                    return [formatLargeNumber(value), name]
                  }
                  if (typeof value === "number" && !isNaN(value)) {
                    return [`$${value.toFixed(3)}`, name]
                  }
                  return ["N/A", name]
                }}
              />
              <Legend />
              <Scatter name="Models" data={contextWindowData} fill="#FFCD6F" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}


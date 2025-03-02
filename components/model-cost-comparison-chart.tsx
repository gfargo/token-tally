import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ModelCostComparisonChartProps {
  modelName: string
  modelInputCost: number
  modelOutputCost: number
  averageInputCost: number
  averageOutputCost: number
}

export function ModelCostComparisonChart({
  modelName,
  modelInputCost,
  modelOutputCost,
  averageInputCost,
  averageOutputCost,
}: ModelCostComparisonChartProps) {
  const data = [
    {
      name: "Input Cost",
      [modelName]: modelInputCost,
      Average: averageInputCost,
    },
    {
      name: "Output Cost",
      [modelName]: modelOutputCost,
      Average: averageOutputCost,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Comparison</CardTitle>
        <CardDescription>Compare {modelName} costs with average costs across all models</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={modelName} fill="#FFCD6F" />
            <Bar dataKey="Average" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


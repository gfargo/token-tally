"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ModelCostData {
  model: string
  inputCost: number
  outputCost: number
}

interface ModelCostChartsProps {
  data: ModelCostData[]
}

export function ModelCostCharts({ data }: ModelCostChartsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Input Cost Comparison</CardTitle>
          <CardDescription>Compare input costs across different models</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="model" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inputCost" name="Input Cost" fill="#FFCD6F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Output Cost Comparison</CardTitle>
          <CardDescription>Compare output costs across different models</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="model" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="outputCost" name="Output Cost" fill="#FFCD6F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}


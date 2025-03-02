import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ModelMetadata {
  name: string
  provider: string
  category: string
  contextWindow?: number
  inputCost: number
  outputCost: number
}

interface ModelMetadataCardProps {
  metadata: ModelMetadata
}

export function ModelMetadataCard({ metadata }: ModelMetadataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {metadata.name}
          <Badge>{metadata.provider}</Badge>
        </CardTitle>
        <CardDescription>{metadata.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Input Cost</dt>
            <dd className="text-lg">${metadata.inputCost.toFixed(4)} / 1M tokens</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Output Cost</dt>
            <dd className="text-lg">${metadata.outputCost.toFixed(4)} / 1M tokens</dd>
          </div>
          {metadata.contextWindow && (
            <div className="col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">Context Window</dt>
              <dd className="text-lg">{metadata.contextWindow.toLocaleString()} tokens</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}


"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BaseTextModel } from '@/lib/models';
import { getCalculatorUrl } from "@/utils/providerUtils";
import {
  Cpu,
  DollarSign,
  FileText,
  ImageIcon,
  LayoutTemplate,
  MessageSquare,
  Mic,
  Zap,
} from "lucide-react";
import Link from "next/link";

const getModelIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "text generation":
    case "gpt":
    case "reasoning":
      return <MessageSquare className="h-5 w-5" />;
    case "image generation":
      return <ImageIcon className="h-5 w-5" />;
    case "embedding":
      return <FileText className="h-5 w-5" />;
    case "audio transcription":
    case "text to speech":
      return <Mic className="h-5 w-5" />;
    default:
      return <Zap className="h-5 w-5" />;
  }
};

export const ModelCard = ({ model }: { model: BaseTextModel }) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-xl">
          {getModelIcon(model.category)}
          <span>{model.model}</span>
        </CardTitle>
        <Link href={getCalculatorUrl(model.provider)}>
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
          >
            {model.provider}
          </Badge>
        </Link>
      </div>
      <CardDescription>{model.category}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            Input: $
            {typeof model.inputCost === "number"
              ? model.inputCost.toFixed(4)
              : "Varies"}{" "}
            / 1M tokens
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            Output: $
            {typeof model.outputCost === "number"
              ? model.outputCost.toFixed(4)
              : "Varies"}{" "}
            / 1M tokens
          </span>
        </div>
        {model.contextWindow && (
          <div className="flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              Context: {model.contextWindow.toLocaleString()} tokens
            </span>
          </div>
        )}
        {model.fineTuning && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Fine-tuning:</span>
            </div>
            <ul className="list-disc list-inside pl-6 space-y-1">
              <li>Input: ${model.fineTuning.input.toFixed(4)} / 1M tokens</li>
              <li>Output: ${model.fineTuning.output.toFixed(4)} / 1M tokens</li>
              <li>
                Training: ${model.fineTuning.training.toFixed(2)} / 1M tokens
              </li>
            </ul>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

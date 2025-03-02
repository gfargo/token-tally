 import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import EmbeddingsCalculator from "./_components/calculator";
import { metadata } from "./metadata";

export { metadata };

export default function EmbeddingCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link
          href="/"
          className="mr-4"
        >
          <Button
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          Embedding Models Pricing Calculator
        </h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="https://openai.com/pricing#embedding-models"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>View OpenAI&apos;s official embedding pricing page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <p className="text-muted-foreground mb-8">
        Estimate costs for various embedding models from OpenAI and Cohere.
      </p>

      <EmbeddingsCalculator />
    </div>
  );
}

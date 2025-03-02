"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { getAllModels } from '@/lib/models';
import {
  Calculator,
  CommandIcon,
  DollarSign,
  List,
  MessageSquare,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";

const calculators = [
  { name: "OpenAI GPT", href: "/calculators/openai" },
  { name: "Claude", href: "/calculators/claude" },
  { name: "Gemini", href: "/calculators/gemini" },
  { name: "DALL-E", href: "/calculators/dalle" },
  { name: "Whisper & TTS", href: "/calculators/audio" },
  { name: "Embedding", href: "/calculators/embedding" },
  { name: "Cohere", href: "/calculators/cohere" },
  { name: "Perplexity.ai", href: "/calculators/perplexity" },
];

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");
  const debouncedTokenInput = useDebounce(tokenInput, 300);
  const [calculatedCosts, setCalculatedCosts] = useState<
    Array<{
      model: string;
      provider: string;
      inputCost: number;
      outputCost: number;
      totalCost: number;
      href: string;
    }>
  >([]);

  useEffect(() => {
    if (debouncedTokenInput) {
      const [inputTokens, outputTokens] = debouncedTokenInput
        .split("/")
        .map(Number);
      if (!isNaN(inputTokens)) {
        const allModels = getAllModels();
        const costs = allModels.textModels.map((model) => {
          const actualOutputTokens = !isNaN(outputTokens)
            ? outputTokens
            : inputTokens;
          const inputCost = (model.inputCost * inputTokens) / 1_000_000;
          const outputCost =
            (model.outputCost * actualOutputTokens) / 1_000_000;
          return {
            model: model.model,
            provider: model.provider,
            inputCost,
            outputCost,
            totalCost: inputCost + outputCost,
            href: `/calculators/${model.provider.toLowerCase()}`,
          };
        });
        setCalculatedCosts(costs);
      } else {
        setCalculatedCosts([]);
      }
    } else {
      setCalculatedCosts([]);
    }
  }, [debouncedTokenInput]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search calculators...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-transparent active:border-transparent focus:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter tokens (e.g., 5000 or 5000/120000)..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
        </div>
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {calculatedCosts.length > 0 ? (
            <CommandGroup heading="Calculated Costs">
              {calculatedCosts.map((cost, index) => (
                <CommandItem
                  key={`${cost.model}-${index}`}
                  onSelect={() =>
                    runCommand(() => {
                      const [input, output] = tokenInput.split("/");
                      router.push(
                        `${cost.href}?input=${input}&output=${output || input}`
                      );
                    })
                  }
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span className="font-medium">{cost.model}</span>
                        <Badge
                          variant="secondary"
                          className="ml-2"
                        >
                          {cost.provider}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <span className="mr-2">
                          Input: ${cost.inputCost.toFixed(6)}
                        </span>
                        <span>Output: ${cost.outputCost.toFixed(6)}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        ${cost.totalCost.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandGroup heading="Calculators">
              {calculators.map((calculator) => (
                <CommandItem
                  key={calculator.href}
                  onSelect={() =>
                    runCommand(() => router.push(calculator.href))
                  }
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  {calculator.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
          <CommandGroup heading="General">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <CommandIcon className="mr-2 h-4 w-4" />
              Go to Home
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/models"))}
            >
              <List className="mr-2 h-4 w-4" />
              All Models
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/feedback"))}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Feedback
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

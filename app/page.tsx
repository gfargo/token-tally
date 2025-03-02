"use client"

import GlobalPricingTable from "@/components/global-pricing-table"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  Calculator,
  Command,
  Download,
  Image,
  Maximize2,
  MessageSquare,
  MicIcon,
  RefreshCw,
  Search,
  Table,
} from "lucide-react"
import Link from "next/link"
import type React from "react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl relative">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4"><span className="sr-only">TokenTally:</span> An All-in-One AI Cost Calculator</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Estimate costs for various AI models and make informed decisions for your projects.
        </p>
        <div className="flex justify-center items-center space-x-4 mb-6">
          <span className="inline-flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Multiple calculators
          </span>
          <span className="inline-flex items-center">
            <Command className="w-5 h-5 mr-2" />
            Quick calculations (Cmd+K)
          </span>
          <span className="inline-flex items-center">
            <Table className="w-5 h-5 mr-2" />
            Comprehensive pricing tables
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Access detailed model information and download complete datasets.
          <Link href="/models" className="underline ml-1">
            View all models
          </Link>{" "}
          or use the
          <Link href="#" className="underline mx-1">
            download button
          </Link>
          <Download className="w-4 h-4 inline-block ml-1" /> in the header.
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 5 }}
      >
        <CalculatorCard
          title="OpenAI GPT"
          description="Calculate costs for GPT-4.5, O1, O3-mini, GPT-4o, and other models."
          icon={<MessageSquare className="h-5 w-5" />}
          href="/calculators/openai"
        />
        <CalculatorCard
          title="Claude"
          description="Calculate costs for Claude 3 Opus, Sonnet, and Haiku models."
          icon={<MessageSquare className="h-5 w-5" />}
          href="/calculators/claude"
        />
        <CalculatorCard
          title="Gemini"
          description="Calculate costs for Google's Gemini models and features."
          icon={<MessageSquare className="h-5 w-5" />}
          href="/calculators/gemini"
        />
        <CalculatorCard
          title="DALL-E"
          description="Calculate image generation costs for DALL-E 2 and DALL-E 3."
          icon={<Image className="h-5 w-5" />}
          href="/calculators/dalle"
        />
        <CalculatorCard
          title="Whisper & TTS"
          description="Calculate costs for audio transcription and text-to-speech."
          icon={<MicIcon className="h-5 w-5" />}
          href="/calculators/audio"
        />
        <CalculatorCard
          title="Embedding"
          description="Calculate costs for different OpenAI embedding models."
          icon={<Search className="h-5 w-5" />}
          href="/calculators/embedding"
        />
        <CalculatorCard
          title="Cohere"
          description="Calculate costs for Command, Embed, and Rerank models."
          icon={<MessageSquare className="h-5 w-5" />}
          href="/calculators/cohere"
        />
        <CalculatorCard
          title="Perplexity.ai"
          description="Calculate costs for Sonar and R1-1776 models."
          icon={<Search className="h-5 w-5" />}
          href="/calculators/perplexity"
        />
        <CalculatorCard
          title="Always Up-to-Date"
          description="Our pricing information is constantly updated. Share your feedback and help improve TokenTally."
          icon={<RefreshCw className="h-5 w-5" />}
          href="/feedback"
          isSpecial={true}
        />
      </motion.div>

      <GlobalPricingTable />
    </div>
  )
}

export function CalculatorCard({
  title,
  description,
  icon,
  href,
  isSpecial = false,
}: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  isSpecial?: boolean
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link href={href} className="group">
        <div
          className={`border rounded-lg p-6 h-full hover:shadow-md transition-all duration-200 hover:border-primary/50 flex flex-col ${isSpecial ? "bg-gradient-to-br from-primary/10 to-secondary/10" : ""}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`rounded-full p-2 ${isSpecial ? "bg-primary/20" : "bg-primary/10"}`}>{icon}</div>
            {isSpecial ? (
              <Badge variant="outline" className="bg-primary/20 text-primary-foreground">
                New
              </Badge>
            ) : (
              <Maximize2 className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground text-sm flex-grow">{description}</p>
        </div>
      </Link>
    </motion.div>
  )
}


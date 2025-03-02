"use client"

import { useState, useEffect } from "react"
import { Download, FileJson, Database, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getAllModels } from "@/config/pricing"
import { FeedbackModal } from "@/components/feedback-modal"

export function DownloadButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isDownloading) {
      timer = setTimeout(() => {
        setIsModalOpen(true)
        setIsDownloading(false)
      }, 1280)
    }
    return () => clearTimeout(timer)
  }, [isDownloading])

  const handleDownload = () => {
    const allModels = getAllModels()
    const data = JSON.stringify(allModels, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "ai-models-data.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Set downloading state to true, which will trigger the useEffect
    setIsDownloading(true)
  }

  const modelCount = Object.values(getAllModels()).reduce((acc, curr) => acc + curr.length, 0)
  const dataSizeKB = JSON.stringify(getAllModels()).length / 1024

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download models data</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="w-80 p-4">
            <div className="flex flex-col space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Download Full Models Data (JSON)
              </h3>
              <p className="text-sm">Get a complete export of all AI model data used on this site.</p>
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4" />
                <span>Total models: {modelCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="h-4 w-4" />
                <span>File size: {dataSizeKB.toFixed(2)} KB</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}


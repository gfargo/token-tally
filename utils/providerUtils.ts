export function getCalculatorUrl(provider: string): string {
  const providerMap: { [key: string]: string } = {
    Google: "gemini",
    "Perplexity.ai": "perplexity",
    // Add more mappings here if needed
  }

  const normalizedProvider = provider.toLowerCase()
  return `/calculators/${providerMap[provider] || normalizedProvider}`
}


import { defaultRateLimit, PluginConfig, RateLimit } from "@/app/page"
import { useCallback } from "react"

 function useSchemaRateLimits(config: PluginConfig, setConfig: React.Dispatch<React.SetStateAction<PluginConfig>>) {
    const addRateLimit = useCallback(() => {
      setConfig((prev) => ({
        ...prev,
        rateLimits: [...prev.rateLimits, defaultRateLimit()],
      }))
    }, [setConfig])

    const removeRateLimit = useCallback((rateLimitId: string) => {
      setConfig((prev) => ({
        ...prev,
        rateLimits: prev.rateLimits.filter((rateLimit) => rateLimit.id !== rateLimitId),
      }))
    }, [setConfig])

    const updateRateLimit = useCallback((rateLimitId: string, updates: Partial<RateLimit>) => {
      setConfig((prev) => ({
        ...prev,
        rateLimits: prev.rateLimits.map((rateLimit) =>
          rateLimit.id === rateLimitId ? { ...rateLimit, ...updates } : rateLimit,
        ),
      }))
    }, [setConfig])

    return { addRateLimit, removeRateLimit, updateRateLimit }
  }


  export default useSchemaRateLimits
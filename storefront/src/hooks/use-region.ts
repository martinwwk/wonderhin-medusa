import { useQuery } from "@tanstack/react-query"
import { HttpTypes } from "@medusajs/types"
import { getRegionClient } from "@/lib/data/regions-client"

/**
 * Client-side hook to get the default Medusa region.
 * Cached for 10 minutes; shared across all consumers.
 */
export function useRegion() {
  return useQuery<HttpTypes.StoreRegion | null>({
    queryKey: ["region"],
    queryFn: getRegionClient,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

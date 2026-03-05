import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

/**
 * Client-side: list all regions from Medusa backend.
 */
export const listRegionsClient = async (): Promise<HttpTypes.StoreRegion[]> => {
  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      cache: "no-store",
    })
    .then(({ regions }) => regions)
    .catch((error) => {
      console.error("Error fetching regions:", error)
      return []
    })
}

/**
 * Client-side: get the default region (HK first, otherwise first available).
 * This mirrors the logic in the server-side getRegion() but without "use server".
 */
export const getRegionClient = async (): Promise<HttpTypes.StoreRegion | null> => {
  const regions = await listRegionsClient()
  if (!regions || regions.length === 0) return null

  const hkRegion = regions.find((r) =>
    r.countries?.some((c) => c.iso_2 === "hk")
  )
  return hkRegion ?? regions[0]
}

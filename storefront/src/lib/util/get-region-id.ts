import { getRegion } from "@/lib/data/regions"

/**
 * Gets the region ID for a given country code or locale
 * This is a utility wrapper around getRegion that returns just the ID
 */
export async function getRegionId(countryCodeOrLocale: string): Promise<string | null> {
  const region = await getRegion(countryCodeOrLocale)
  return region?.id || null
}

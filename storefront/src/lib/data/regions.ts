"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Lists all regions from the backend.
export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

// Retrieves a region by its ID.
export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

/**
 * Gets a region by country code.
 * 
 * Since locales are independent of regions/currencies:
 * - Always defaults to 'hk' (Hong Kong) region with HKD currency
 * - When multiple regions exist for the same country, checks localStorage for currency preference
 * - Falls back to HKD region if available
 * 
 * @param countryCodeOrLocale - Can be 'hk', 'en', 'zh-TW', etc. Always defaults to HK region.
 */
export const getRegion = async (countryCodeOrLocale: string) => {
  try {
    const regions = await listRegions()

    if (!regions || regions.length === 0) {
      return null
    }

    // Always default to Hong Kong region
    const DEFAULT_COUNTRY = 'hk'
    
    // Build region map by country code
    const regionsByCountry = new Map<string, HttpTypes.StoreRegion[]>()
    
    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        const iso2 = c?.iso_2 ?? ""
        if (!regionsByCountry.has(iso2)) {
          regionsByCountry.set(iso2, [])
        }
        regionsByCountry.get(iso2)!.push(region)
        
        // Cache first region per country
        if (!regionMap.has(iso2)) {
          regionMap.set(iso2, region)
        }
      })
    })

    // Check if input is actually a country code that exists
    const inputLower = countryCodeOrLocale.toLowerCase()
    const regionsForInput = regionsByCountry.get(inputLower) || []
    
    // If input is not a valid country code (e.g., it's a locale like 'en', 'zh-TW'),
    // use default HK region
    const regionsForCountry = regionsForInput.length > 0 
      ? regionsForInput 
      : (regionsByCountry.get(DEFAULT_COUNTRY) || [])

    if (regionsForCountry.length === 0) {
      // Fallback to any available region
      return regions[0]
    }

    if (regionsForCountry.length === 1) {
      // Only one region for this country
      return regionsForCountry[0]
    }

    // Multiple regions for this country - check user's currency preference
    const relevantCountry = regionsForInput.length > 0 ? inputLower : DEFAULT_COUNTRY
    
    if (typeof window !== 'undefined') {
      const preferredCurrency = localStorage.getItem(`currency_${relevantCountry}`)
      if (preferredCurrency) {
        const preferredRegion = regionsForCountry.find(
          r => r.currency_code?.toUpperCase() === preferredCurrency.toUpperCase()
        )
        if (preferredRegion) {
          return preferredRegion
        }
      }
    }

    // Default to HKD region if available, otherwise first region
    const hkdRegion = regionsForCountry.find(r => r.currency_code?.toLowerCase() === 'hkd')
    return hkdRegion || regionsForCountry[0]
  } catch (e: any) {
    console.error('Error getting region:', e)
    return null
  }
}

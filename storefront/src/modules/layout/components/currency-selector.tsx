"use client"

import { useState, useRef, useEffect } from "react"
import ChevronDown from "@modules/common/icons/chevron-down"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { updateCurrency } from "@lib/data/cart"

interface CurrencySelectorProps {
  regions: HttpTypes.StoreRegion[]
}

const CurrencySelector = ({ regions }: CurrencySelectorProps) => {
  const [open, setOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  // Get regions for current country (always HK for now)
  // Note: countryCode in URL is actually the locale, but we always use HK region
  const ACTUAL_COUNTRY = 'hk'
  const regionsForCountry = regions.filter((r) =>
    r.countries?.some((c) => c.iso_2 === ACTUAL_COUNTRY)
  )

  // If only one currency available, don't show selector
  if (regionsForCountry.length <= 1) {
    return null
  }

  // Get current region's currency (prefer HKD by default, or check localStorage)
  let currentRegion = regionsForCountry[0]
  if (typeof window !== 'undefined') {
    const preferredCurrency = localStorage.getItem(`currency_${ACTUAL_COUNTRY}`)
    if (preferredCurrency) {
      const preferredRegion = regionsForCountry.find(
        r => r.currency_code?.toUpperCase() === preferredCurrency.toUpperCase()
      )
      if (preferredRegion) {
        currentRegion = preferredRegion
      }
    }
  }
  const currentCurrency = currentRegion?.currency_code?.toUpperCase() || ""

  const handleCurrencyChange = async (regionId: string, currency: string) => {
    setOpen(false)
    setIsUpdating(true)
    
    // Store selected currency in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem(`currency_${ACTUAL_COUNTRY}`, currency)
    }

    try {
      // Update cart with new region (currency)
      await updateCurrency(regionId)
      
      // Refresh to apply new prices
      router.refresh()
    } catch (error) {
      console.error("Failed to update currency:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 hover:text-ui-fg-base text-sm font-medium disabled:opacity-50"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select currency"
        type="button"
        disabled={isUpdating}
      >
        <span>{currentCurrency}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 border">
          <ul className="py-2">
            {regionsForCountry.map((region) => {
              const currency = region.currency_code?.toUpperCase() || ""
              return (
                <li key={region.id}>
                  <button
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      currency === currentCurrency ? "font-bold bg-gray-50" : ""
                    }`}
                    onClick={() => handleCurrencyChange(region.id, currency)}
                    disabled={isUpdating}
                  >
                    {currency}
                    <span className="text-xs text-gray-500 ml-2">
                      ({region.name})
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CurrencySelector

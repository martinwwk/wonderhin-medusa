"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { StateType } from "@lib/hooks/use-toggle-state"

type CurrencyOption = {
  currency: string
  region: string
  label: string
  countryCode: string
}

type CurrencySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CurrencySelect = ({ toggleState, regions }: CurrencySelectProps) => {
  const [current, setCurrent] = useState<CurrencyOption | undefined>(undefined)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const { state, close } = toggleState

  // Get all available currencies for the current country
  const options = useMemo(() => {
    if (!countryCode) return []

    const regionsForCountry = regions.filter((r) =>
      r.countries?.some((c) => c.iso_2 === countryCode)
    )

    return regionsForCountry
      .map((r) => ({
        currency: r.currency_code?.toUpperCase() || "",
        region: r.id,
        label: r.currency_code?.toUpperCase() || "",
        countryCode: countryCode as string,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions, countryCode])

  // Find current region by matching country code
  useEffect(() => {
    if (countryCode && regions.length > 0) {
      const currentRegion = regions.find((r) =>
        r.countries?.some((c) => c.iso_2 === countryCode)
      )
      if (currentRegion) {
        setCurrent({
          currency: currentRegion.currency_code?.toUpperCase() || "",
          region: currentRegion.id,
          label: currentRegion.currency_code?.toUpperCase() || "",
          countryCode: countryCode as string,
        })
      }
    }
  }, [regions, countryCode])

  const handleChange = (option: CurrencyOption) => {
    // Keep the same country but switch to a different region (currency)
    updateRegion(option.countryCode, currentPath)
    close()
  }

  // Only show currency selector if there are multiple currencies for this country
  if (options.length <= 1) return null

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        value={current}
      >
        <ListboxButton className="py-1 w-full">
          <div className="txt-compact-small flex items-start gap-x-2">
            <span>Currency:</span>
            {current && (
              <span className="txt-compact-small font-semibold">
                {current.label}
              </span>
            )}
          </div>
        </ListboxButton>
        <div className="flex relative w-full min-w-[320px]">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute -bottom-[calc(100%-36px)] left-0 xsmall:left-auto xsmall:right-0 max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded w-full"
              static
            >
              {options.map((o, index) => (
                <ListboxOption
                  key={index}
                  value={o}
                  className="py-2 hover:bg-gray-200 px-3 cursor-pointer flex items-center gap-x-2"
                >
                  <span className="font-semibold">{o.currency}</span>
                  <span className="text-gray-600 text-xs">
                    {regions.find((r) => r.id === o.region)?.name}
                  </span>
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CurrencySelect

"use client"

import NativeSelect from "@modules/common/components/native-select"
import { useClientTranslation } from "@lib/i18n"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export type SortOptions = "price_asc" | "price_desc" | "created_at" | "created_at_asc"

type SortDropdownProps = {
  sortBy: SortOptions
  "data-testid"?: string
}

const SortDropdown = ({
  "data-testid": dataTestId,
  sortBy,
}: SortDropdownProps) => {
  const { t } = useClientTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortOptions = [
    {
      value: "created_at" as const,
      label: t('latestArrivals'),
    },
    {
      value: "created_at_asc" as const,
      label: t('oldestFirst'),
    },
    {
      value: "price_asc" as const,
      label: t('priceLowHigh'),
    },
    {
      value: "price_desc" as const,
      label: t('priceHighLow'),
    },
  ]

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryParams("sortBy", e.target.value)
  }

  return (
    <div className="flex items-center gap-2" data-testid={dataTestId}>
      <span className="text-sm text-ui-fg-subtle whitespace-nowrap">{t('sortBy')}:</span>
      <NativeSelect
        value={sortBy}
        onChange={handleChange}
        className="min-w-[200px]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}

export default SortDropdown

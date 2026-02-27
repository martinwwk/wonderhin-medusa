"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { useClientTranslation } from "@lib/i18n"

export type SortOptions = "price_asc" | "price_desc" | "created_at" | "created_at_asc"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const { t } = useClientTranslation()
  
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
  
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterRadioGroup
      title={t('sortBy')}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts

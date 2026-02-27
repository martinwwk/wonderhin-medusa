"use client"

import { useClientTranslation } from "@lib/i18n"
import { Text } from "@medusajs/ui"

type RefinementListProps = {
  sortBy?: any
  search?: boolean
  'data-testid'?: string
}

const RefinementList = ({ 'data-testid': dataTestId }: RefinementListProps) => {
  const { t } = useClientTranslation()

  return (
    <div className="flex small:flex-col gap-8 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]" data-testid={dataTestId}>
      {/* Categories Section - Placeholder for future implementation */}
      <div className="flex flex-col gap-3">
        <Text className="txt-compact-small-plus text-ui-fg-muted">
          Categories
        </Text>
        <Text className="txt-compact-small text-ui-fg-subtle">
          All products
        </Text>
      </div>

      {/* Price Range Section - Placeholder for future implementation */}
      <div className="flex flex-col gap-3">
        <Text className="txt-compact-small-plus text-ui-fg-muted">
          Price Range
        </Text>
        <Text className="txt-compact-small text-ui-fg-subtle">
          All prices
        </Text>
      </div>
    </div>
  )
}

export default RefinementList

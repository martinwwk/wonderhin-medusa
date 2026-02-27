"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { getServerTranslation } from "@lib/server-i18n"
import { translateVariantTitle } from "@lib/util/translate-product"
import { useMemo } from "react"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
  countryCode?: string
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
  countryCode = "en",
}: LineItemOptionsProps) => {
  const variantLabel = useMemo(() => getServerTranslation(countryCode, 'variant'), [countryCode])
  const translatedVariantTitle = useMemo(
    () => translateVariantTitle(variant?.title, countryCode),
    [variant?.title, countryCode]
  )
  
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-medium text-ui-fg-subtle w-full overflow-hidden text-ellipsis"
    >
      {variantLabel}: {translatedVariantTitle}
    </Text>
  )
}

export default LineItemOptions

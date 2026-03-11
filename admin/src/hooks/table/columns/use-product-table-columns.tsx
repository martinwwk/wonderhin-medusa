import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import {
  CollectionCell,
  CollectionHeader,
} from "../../../components/table/table-cells/product/collection-cell/collection-cell"
import {
  ProductCell,
  ProductHeader,
} from "../../../components/table/table-cells/product/product-cell"
import {
  ProductStatusCell,
  ProductStatusHeader,
} from "../../../components/table/table-cells/product/product-status-cell"
import {
  SalesChannelHeader,
  SalesChannelsCell,
} from "../../../components/table/table-cells/product/sales-channels-cell"
import {
  VariantCell,
  VariantHeader,
} from "../../../components/table/table-cells/product/variant-cell"
import { HttpTypes } from "@medusajs/types"

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

export const useProductTableColumns = (
  activeLocale: string = "en",
  localeLookupKey?: string,
  translationsMap?: Record<string, Record<string, Record<string, string>>>
) => {
  // Helper to get translated title for a product - exact match only
  const getTranslatedTitle = (product: HttpTypes.AdminProduct) => {
    if (activeLocale === "en" || !translationsMap || !localeLookupKey) {
      return product.title
    }

    // Only use exact match - if no translation found, return default (product.title)
    const translation = translationsMap[product.id]?.[localeLookupKey]
    if (translation?.title) {
      return translation.title
    }

    return product.title
  }

  return useMemo(
    () => [
      columnHelper.display({
        id: "product",
        header: () => <ProductHeader />,
        cell: ({ row }) => {
          const translatedTitle = getTranslatedTitle(row.original)
          return <ProductCell product={row.original} translatedTitle={translatedTitle} />
        },
      }),
      columnHelper.accessor("collection", {
        header: () => <CollectionHeader />,
        cell: ({ row }) => (
          <CollectionCell collection={row.original.collection} />
        ),
      }),
      columnHelper.accessor("sales_channels", {
        header: () => <SalesChannelHeader />,
        cell: ({ row }) => (
          <SalesChannelsCell salesChannels={row.original.sales_channels} />
        ),
      }),
      columnHelper.accessor("variants", {
        header: () => <VariantHeader />,
        cell: ({ row }) => <VariantCell variants={row.original.variants} />,
      }),
      columnHelper.accessor("status", {
        header: () => <ProductStatusHeader />,
        cell: ({ row }) => <ProductStatusCell status={row.original.status} />,
      }),
    ],
    [activeLocale, localeLookupKey, translationsMap]
  )
}

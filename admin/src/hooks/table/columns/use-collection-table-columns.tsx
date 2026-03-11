import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { TextCell } from "../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<HttpTypes.AdminCollection>()

export const useCollectionTableColumns = (
  activeLocale: string = "en",
  localeLookupKey?: string,
  translationsMap?: Record<string, Record<string, Record<string, string>>>
) => {
  const { t } = useTranslation()

  // Helper to get translated title for a collection - exact match only
  const getTranslatedTitle = (collection: HttpTypes.AdminCollection) => {
    if (activeLocale === "en" || !translationsMap || !localeLookupKey) {
      return collection.title
    }

    // Only use exact match - if no translation found, return default (collection.title)
    const translation = translationsMap[collection.id]?.[localeLookupKey]
    if (translation?.title) {
      return translation.title
    }

    return collection.title
  }

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ getValue, row }) => {
          const translatedTitle = getTranslatedTitle(row.original)
          return <TextCell text={translatedTitle} />
        },
      }),
      columnHelper.accessor("handle", {
        header: t("fields.handle"),
        cell: ({ getValue }) => <TextCell text={`/${getValue()}`} />,
      }),
      columnHelper.accessor("products", {
        header: t("fields.products"),
        cell: ({ getValue }) => {
          const count = getValue()?.length || undefined

          return <TextCell text={count} />
        },
      }),
    ],
    [t, activeLocale, localeLookupKey, translationsMap]
  )
}

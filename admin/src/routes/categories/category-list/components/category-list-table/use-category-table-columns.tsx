import { TriangleRightMini } from "@medusajs/icons"
import { AdminProductCategoryResponse } from "@medusajs/types"
import { IconButton, Text, clx } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import {
  TextCell,
  TextHeader,
} from "../../../../../components/table/table-cells/common/text-cell"
import {
  getCategoryPath,
  getIsActiveProps,
  getIsInternalProps,
} from "../../../common/utils"

const columnHelper =
  createColumnHelper<AdminProductCategoryResponse["product_category"]>()

export const useCategoryTableColumns = (
  activeLocale: string = "en",
  localeLookupKey?: string,
  translationsMap?: Record<string, Record<string, Record<string, string>>>
) => {
  const { t } = useTranslation()

  // Helper to get translated name for a category - exact match only
  const getTranslatedName = (category: AdminProductCategoryResponse["product_category"]) => {
    if (activeLocale === "en" || !translationsMap || !localeLookupKey) {
      return category.name
    }

    // Only use exact match - if no translation found, return default (category.name)
    const translation = translationsMap[category.id]?.[localeLookupKey]
    if (translation?.name) {
      return translation.name
    }

    return category.name
  }

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <TextHeader text={t("fields.name")} />,
        cell: ({ getValue, row }) => {
          const expandHandler = row.getToggleExpandedHandler()
          const category = row.original

          if (row.original.parent_category !== undefined) {
            const path = getCategoryPath(row.original)

            return (
              <div className="flex size-full items-center gap-1 overflow-hidden">
                {path.map((chip, index) => {
                  const translatedName = getTranslatedName(chip)
                  return (
                    <div
                      key={chip.id}
                      className={clx("overflow-hidden", {
                        "text-ui-fg-muted flex items-center gap-x-1":
                          index !== path.length - 1,
                      })}
                    >
                      <Text size="small" leading="compact" className="truncate">
                        {translatedName}
                      </Text>
                      {index !== path.length - 1 && (
                        <Text size="small" leading="compact">
                          /
                        </Text>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          }

          const translatedName = getTranslatedName(category)

          return (
            <div className="flex size-full items-center gap-x-3 overflow-hidden">
              <div className="flex size-7 items-center justify-center">
                {row.getCanExpand() ? (
                  <IconButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()

                      expandHandler()
                    }}
                    size="small"
                    variant="transparent"
                    className="text-ui-fg-subtle"
                  >
                    <TriangleRightMini
                      className={clx({
                        "rotate-90 transition-transform will-change-transform":
                          row.getIsExpanded(),
                      })}
                    />
                  </IconButton>
                ) : null}
              </div>
              <span className="truncate">{translatedName}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("handle", {
        header: () => <TextHeader text={t("fields.handle")} />,
        cell: ({ getValue }) => {
          return <TextCell text={`/${getValue()}`} />
        },
      }),
      columnHelper.accessor("is_active", {
        header: () => <TextHeader text={t("fields.status")} />,
        cell: ({ getValue }) => {
          const { color, label } = getIsActiveProps(getValue(), t)

          return <StatusCell color={color}>{label}</StatusCell>
        },
      }),
      columnHelper.accessor("is_internal", {
        header: () => (
          <TextHeader text={t("categories.fields.visibility.label")} />
        ),
        cell: ({ getValue }) => {
          const { color, label } = getIsInternalProps(getValue(), t)

          return <StatusCell color={color}>{label}</StatusCell>
        },
      }),
    ],
    [t, activeLocale, localeLookupKey, translationsMap]
  )
}

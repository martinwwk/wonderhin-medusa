import {
  Buildings,
  Component,
  GlobeEurope,
  PencilSquare,
  Trash,
} from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  Badge,
  clx,
  Container,
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  createDataTableFilterHelper,
  DataTableAction,
  Tooltip,
  usePrompt,
} from "@medusajs/ui"
import * as Tabs from "@radix-ui/react-tabs"
import { keepPreviousData } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { CellContext } from "@tanstack/react-table"
import { useNavigate, useSearchParams } from "react-router-dom"
import { DataTable } from "../../../../../components/data-table"
import { useDataTableDateFilters } from "../../../../../components/data-table/helpers/general/use-data-table-date-filters"
import {
  useDeleteVariantLazy,
  useProductVariants,
} from "../../../../../hooks/api/products"
import { useQueryParams } from "../../../../../hooks/use-query-params"
import { PRODUCT_VARIANT_IDS_KEY } from "../../../common/constants"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useReferenceTranslations } from "../../../../../hooks/api/translations"
import { useStore } from "../../../../../hooks/api/store"
import { languages } from "../../../../../i18n/languages"

type ProductVariantSectionProps = {
  product: HttpTypes.AdminProduct
}

const PAGE_SIZE = 10
const PREFIX = "pv"

export const ProductVariantSection = ({
  product,
}: ProductVariantSectionProps) => {
  const { t } = useTranslation()
  const isTranslationsEnabled = useFeatureFlag("translation")
  const [activeLocale, setActiveLocale] = useState("en")

  // Fetch store locales
  const { store } = useStore()

  const { q, order, offset, allow_backorder, manage_inventory } =
    useQueryParams(
      ["q", "order", "offset", "manage_inventory", "allow_backorder"],
      PREFIX
    )

  const { variants, count, isPending, isError, error } = useProductVariants(
    product.id,
    {
      q,
      order: order ? order : "variant_rank",
      offset: offset ? parseInt(offset) : undefined,
      limit: PAGE_SIZE,
      allow_backorder: allow_backorder
        ? JSON.parse(allow_backorder)
        : undefined,
      manage_inventory: manage_inventory
        ? JSON.parse(manage_inventory)
        : undefined,
      fields:
        "title,sku,thumbnail,*options,created_at,*inventory_items.inventory.location_levels,inventory_quantity,manage_inventory",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  // Get variant IDs for translation queries
  const variantIds = variants?.map((v) => v.id) || []

  // Fetch translations for all variants in the list
  const { translations } = useReferenceTranslations(
    "product_variant",
    variantIds,
    {
      enabled: isTranslationsEnabled && variantIds.length > 0,
    }
  )

  // Get available locales sorted by languages.ts order
  const availableLocales = useMemo(() => {
    const locales = store?.supported_locales || []
    const normalize = (c: string) => c.toLowerCase().replace(/[-_]/g, "")
    return [...locales].sort((a: any, b: any) => {
      const codeA = a.locale_code || a.code
      const codeB = b.locale_code || b.code
      const idxA = languages.findIndex((l) => normalize(l.code) === normalize(codeA))
      const idxB = languages.findIndex((l) => normalize(l.code) === normalize(codeB))
      const orderA = idxA === -1 ? Infinity : idxA
      const orderB = idxB === -1 ? Infinity : idxB
      return orderA - orderB
    })
  }, [store])

  // Get locale display name from languages registry
  const getLocaleName = (locale: any) => {
    const code = locale.locale_code || locale.code
    const normalize = (c: string) => c.toLowerCase().replace(/[-_]/g, "")
    const lang = languages.find((l) => normalize(l.code) === normalize(code))
    return lang?.display_name || (code === "en" ? "English" : code.toUpperCase())
  }

  // Build translations map keyed by variant id and locale
  const translationsMap = useMemo(() => {
    if (!translations) return {}
    const map: Record<string, Record<string, string>> = {}
    translations.forEach((tr: any) => {
      const refId = tr.reference_id
      const locale = tr.locale_code
      if (!map[refId]) map[refId] = {}
      if (tr.translations) {
        map[refId][locale] = {
          ...map[refId][locale],
          ...tr.translations,
        }
      }
    })
    return map
  }, [translations])

  // Now we can call useColumns with translationsMap defined
  const columns = useColumns(product, activeLocale, translationsMap)
  const filters = useFilters()
  const commands = useCommands()

  const translationParams = new URLSearchParams()
  variants?.forEach((variant) => {
    translationParams.append("reference_id", variant.id)
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      {/* Language Tabs - at the top */}
      {isTranslationsEnabled && (
        <Tabs.Root value={activeLocale} onValueChange={setActiveLocale}>
          <Tabs.List className="flex px-6 border-b border-ui-border-base">
            <Tabs.Trigger
              key="en"
              value="en"
              className="-mb-px border-b-2 border-transparent pb-3 pt-4 text-sm font-medium text-ui-fg-subtle hover:text-ui-fg-base data-[state=active]:border-ui-fg-base data-[state=active]:text-ui-fg-base mr-4 outline-none"
            >
              English
            </Tabs.Trigger>
            {availableLocales
              .filter((locale: any) => (locale.locale_code || locale.code) !== "en")
              .map((locale: any) => (
                <Tabs.Trigger
                  key={locale.locale_code || locale.code}
                  value={locale.locale_code || locale.code}
                  className="-mb-px border-b-2 border-transparent pb-3 pt-4 text-sm font-medium text-ui-fg-subtle hover:text-ui-fg-base data-[state=active]:border-ui-fg-base data-[state=active]:text-ui-fg-base mr-4 outline-none"
                >
                  {getLocaleName(locale)}
                </Tabs.Trigger>
              ))}
          </Tabs.List>
        </Tabs.Root>
      )}
      <DataTable
        data={variants}
        columns={columns}
        filters={filters}
        rowCount={count}
        getRowId={(row) => row.id}
        rowHref={(row) => `/products/${product.id}/variants/${row.id}`}
        pageSize={PAGE_SIZE}
        isLoading={isPending}
        heading={t("products.variants.header")}
        headingLevel="h2"
        emptyState={{
          empty: {
            heading: t("products.variants.empty.heading"),
            description: t("products.variants.empty.description"),
          },
          filtered: {
            heading: t("products.variants.filtered.heading"),
            description: t("products.variants.filtered.description"),
          },
        }}
        action={{
          label: t("actions.create"),
          to: `variants/create`,
        }}
        actionMenu={{
          groups: [
            {
              actions: [
                {
                  label: t("products.editPrices"),
                  to: `prices`,
                  icon: <PencilSquare />,
                },
                {
                  label: t("inventory.stock.action"),
                  to: `stock`,
                  icon: <Buildings />,
                },
                ...(isTranslationsEnabled
                  ? [
                      {
                        icon: <GlobeEurope />,
                        label: t("translations.actions.manage"),
                        to: `/settings/translations/edit?reference=product_variant&${translationParams.toString()}`,
                      },
                    ]
                  : []),
              ],
            },
          ],
        }}
        commands={commands}
        prefix={PREFIX}
      />
    </Container>
  )
}

const columnHelper =
  createDataTableColumnHelper<HttpTypes.AdminProductVariant>()

const useColumns = (
  product: HttpTypes.AdminProduct,
  activeLocale: string,
  translationsMap?: Record<string, Record<string, Record<string, string>>>
) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutateAsync } = useDeleteVariantLazy(product.id)
  const prompt = usePrompt()
  const [searchParams] = useSearchParams()

  // Helper to get translated title for a variant
  const getTranslatedTitle = (variant: HttpTypes.AdminProductVariant) => {
    if (activeLocale === "en" || !translationsMap) {
      return variant.title
    }
    return translationsMap[variant.id]?.[activeLocale]?.title || variant.title
  }

  // Helper to get translated material for a variant
  const getTranslatedMaterial = (variant: HttpTypes.AdminProductVariant) => {
    if (activeLocale === "en" || !translationsMap) {
      return variant.material
    }
    return translationsMap[variant.id]?.[activeLocale]?.material || variant.material || ""
  }

  const tableSearchParams = useMemo(() => {
    const filtered = new URLSearchParams()
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith(`${PREFIX}_`)) {
        filtered.append(key, value)
      }
    }
    return filtered
  }, [searchParams])

  const handleDelete = useCallback(
    async (id: string, title: string) => {
      const res = await prompt({
        title: t("general.areYouSure"),
        description: t("products.deleteVariantWarning", {
          title,
        }),
        confirmText: t("actions.delete"),
        cancelText: t("actions.cancel"),
      })

      if (!res) {
        return
      }

      await mutateAsync({ variantId: id })
    },
    [mutateAsync, prompt, t]
  )

  const optionColumns = useMemo(() => {
    if (!product?.options) {
      return []
    }

    return product.options.map((option) => {
      return columnHelper.display({
        id: option.id,
        header: option.title,
        cell: ({ row }) => {
          const variantOpt = row.original.options?.find(
            (opt) => opt.option_id === option.id
          )

          if (!variantOpt) {
            return <span className="text-ui-fg-muted">-</span>
          }

          return (
            <div className="flex items-center">
              <Tooltip content={variantOpt.value}>
                <Badge
                  size="2xsmall"
                  title={variantOpt.value}
                  className="inline-flex min-w-[20px] max-w-[140px] items-center justify-center overflow-hidden truncate"
                >
                  {variantOpt.value}
                </Badge>
              </Tooltip>
            </div>
          )
        },
      })
    })
  }, [product])

  const getActions = useCallback(
    (ctx: CellContext<HttpTypes.AdminProductVariant, unknown>) => {
      const variant = ctx.row.original as HttpTypes.AdminProductVariant & {
        inventory_items: { inventory: HttpTypes.AdminInventoryItem }[]
      }

      const mainActions: DataTableAction<HttpTypes.AdminProductVariant>[] = [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          onClick: (row) => {
            navigate(
              `edit-variant?variant_id=${
                row.row.original.id
              }&locale=${activeLocale}&${tableSearchParams.toString()}`,
              {
                state: {
                  restore_params: tableSearchParams.toString(),
                },
              }
            )
          },
        },
        {
          icon: <GlobeEurope />,
          label: t("translations.actions.manage"),
          onClick: () => {
            navigate(
              `/settings/translations/edit?reference=product_variant&reference_id=${variant.id}`
            )
          },
        },
      ]

      const secondaryActions: DataTableAction<HttpTypes.AdminProductVariant>[] =
        [
          {
            icon: <Trash />,
            label: t("actions.delete"),
            onClick: () => handleDelete(variant.id, variant.title!),
          },
        ]

      const inventoryItemsCount = variant.inventory_items?.length || 0

      switch (inventoryItemsCount) {
        case 0:
          break
        case 1: {
          const inventoryItemLink = `/inventory/${
            variant.inventory_items![0].inventory.id
          }`

          mainActions.push({
            label: t("products.variant.inventory.actions.inventoryItems"),
            onClick: () => {
              navigate(inventoryItemLink)
            },
            icon: <Buildings />,
          })
          break
        }
        default: {
          const ids = variant.inventory_items?.map((i) => i.inventory?.id)

          if (!ids || ids.length === 0) {
            break
          }

          const inventoryKitLink = `/inventory?${new URLSearchParams({
            id: ids.join(","),
          }).toString()}`

          mainActions.push({
            label: t("products.variant.inventory.actions.inventoryKit"),
            onClick: () => {
              navigate(inventoryKitLink)
            },
            icon: <Component />,
          })
        }
      }

      return [mainActions, secondaryActions]
    },
    [handleDelete, navigate, t, tableSearchParams, activeLocale]
  )

  const getInventory = useCallback(
    (variant: HttpTypes.AdminProductVariant) => {
      const castVariant = variant as HttpTypes.AdminProductVariant & {
        inventory_items: { inventory: HttpTypes.AdminInventoryItem }[]
      }

      if (!variant.manage_inventory) {
        return {
          text: t("products.variant.inventory.notManaged"),
          hasInventoryKit: false,
          notManaged: true,
        }
      }

      const quantity = variant.inventory_quantity

      const inventoryItems = castVariant.inventory_items
        ?.map((i) => i.inventory)
        .filter(Boolean) as HttpTypes.AdminInventoryItem[]

      const hasInventoryKit = inventoryItems.length > 1

      const locations: Record<string, boolean> = {}

      inventoryItems.forEach((i) => {
        i.location_levels?.forEach((l) => {
          locations[l.id] = true
        })
      })

      const locationCount = Object.keys(locations).length

      const text = hasInventoryKit
        ? t("products.variant.tableItemAvailable", {
            availableCount: quantity,
          })
        : t("products.variant.tableItem", {
            availableCount: quantity,
            locationCount,
            count: locationCount,
          })

      return { text, hasInventoryKit, quantity, notManaged: false }
    },
    [t]
  )

  return useMemo(() => {
    return [
      columnHelper.accessor("thumbnail", {
        header: "",
        headerAlign: "center",
        maxSize: 72,
        cell: ({ row }) => {
          return (
            <div className="flex items-center pl-[1px]">
              <Thumbnail src={row.original.thumbnail} />
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "title",
        header: t("fields.title"),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
        cell: ({ row }) => {
          return getTranslatedTitle(row.original)
        },
      }),
      columnHelper.display({
        id: "material",
        header: t("fields.material"),
        cell: ({ row }) => {
          const material = getTranslatedMaterial(row.original)
          return material || "-"
        },
      }),
      columnHelper.accessor("sku", {
        header: t("fields.sku"),
        enableSorting: true,
        sortAscLabel: t("filters.sorting.alphabeticallyAsc"),
        sortDescLabel: t("filters.sorting.alphabeticallyDesc"),
      }),
      ...optionColumns,
      columnHelper.display({
        id: "inventory",
        header: t("fields.inventory"),
        cell: ({ row }) => {
          const { text, hasInventoryKit, quantity, notManaged } = getInventory(
            row.original
          )

          return (
            <Tooltip content={text}>
              <div className="flex h-full w-full items-center gap-2 overflow-hidden">
                {hasInventoryKit && <Component />}
                <span
                  className={clx("truncate", {
                    "text-ui-fg-error": !quantity && !notManaged,
                  })}
                >
                  {text}
                </span>
              </div>
            </Tooltip>
          )
        },
        maxSize: 250,
      }),
      columnHelper.action({
        actions: getActions,
      }),
    ]
  }, [t, optionColumns, getActions, getInventory])
}

const filterHelper =
  createDataTableFilterHelper<HttpTypes.AdminProductVariant>()

const useFilters = () => {
  const { t } = useTranslation()
  const dateFilters = useDataTableDateFilters()

  return useMemo(() => {
    return [
      filterHelper.accessor("allow_backorder", {
        type: "radio",
        label: t("fields.allowBackorder"),
        options: [
          { label: t("filters.radio.yes"), value: "true" },
          { label: t("filters.radio.no"), value: "false" },
        ],
      }),
      filterHelper.accessor("manage_inventory", {
        type: "radio",
        label: t("fields.manageInventory"),
        options: [
          { label: t("filters.radio.yes"), value: "true" },
          { label: t("filters.radio.no"), value: "false" },
        ],
      }),
      ...dateFilters,
    ]
  }, [t, dateFilters])
}

const commandHelper = createDataTableCommandHelper()

const useCommands = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return [
    commandHelper.command({
      label: t("inventory.stock.action"),
      shortcut: "i",
      action: async (selection) => {
        navigate(
          `stock?${PRODUCT_VARIANT_IDS_KEY}=${Object.keys(selection).join(",")}`
        )
      },
    }),
  ]
}

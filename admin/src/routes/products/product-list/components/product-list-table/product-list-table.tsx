import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { Button, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"

import { HttpTypes } from "@medusajs/types"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import {
  useDeleteProduct,
  useProducts,
} from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { productsLoader } from "../../loader"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { ConfigurableProductListTable } from "./configurable-product-list-table"
import { useReferenceTranslations } from "../../../../../hooks/api/translations"
import { useStore } from "../../../../../hooks/api/store"
import { languages } from "../../../../../i18n/languages"

const PAGE_SIZE = 20

export const ProductListTable = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const isViewConfigEnabled = useFeatureFlag("view_configurations")

  // If feature flag is enabled, use the new configurable table
  if (isViewConfigEnabled) {
    return <ConfigurableProductListTable />
  }

  const isTranslationsEnabled = useFeatureFlag("translation")
  const [activeLocale, setActiveLocale] = useState("en")

  // Fetch store locales
  const { store } = useStore()

  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof productsLoader>>
  >

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const { products, count, isLoading, isError, error } = useProducts(
    {
      ...searchParams,
      is_giftcard: false,
    },
    {
      initialData,
      placeholderData: keepPreviousData,
    }
  )

  // Fetch translations for all products
  const { translations } = useReferenceTranslations(
    "product",
    products?.map((p) => p.id).filter(Boolean) || [],
    {
      enabled: isTranslationsEnabled && (products?.length || 0) > 0,
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

  // Build translations map - only use exact locale code match
  const translationsMap = useMemo(() => {
    if (!translations) return {}
    const map: Record<string, Record<string, Record<string, string>>> = {}
    translations.forEach((tr: any) => {
      const refId = tr.reference_id
      if (!refId) return

      const localeCode = tr.locale_code
      if (!localeCode || !tr.translations) return

      if (!map[refId]) map[refId] = {}
      map[refId][localeCode] = tr.translations
    })
    return map
  }, [translations])

  // Exact match only - no fallback lookup keys
  const localeLookupKey = activeLocale

  const filters = useProductTableFilters()
  const columns = useColumns(activeLocale, localeLookupKey, translationsMap)

  const { table } = useDataTable({
    data: (products ?? []) as HttpTypes.AdminProduct[],
    columns,
    count,
    enablePagination: true,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
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

      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h1">{t("products.domain")}</Heading>
        <div className="flex items-center justify-center gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <Link to={`export${location.search}`}>{t("actions.export")}</Link>
          </Button>
          <Button size="small" variant="secondary" asChild>
            <Link to={`import${location.search}`}>{t("actions.import")}</Link>
          </Button>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      </div>
      <_DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        filters={filters}
        search
        pagination
        isLoading={isLoading}
        queryObject={raw}
        navigateTo={(row) => `${row.original.id}`}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        noRecords={{
          message: t("products.list.noRecordsMessage"),
        }}
      />
      <Outlet />
    </Container>
  )
}

const ProductActions = ({
  product,
  activeLocale = "en",
}: {
  product: HttpTypes.AdminProduct
  activeLocale?: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteProduct(product.id)
  const isTranslationsEnabled = useFeatureFlag("translation")

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("products.deleteWarning", {
        title: product.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("products.toasts.delete.success.header"), {
          description: t("products.toasts.delete.success.description", {
            title: product.title,
          }),
        })
      },
      onError: (e) => {
        toast.error(t("products.toasts.delete.error.header"), {
          description: e.message,
        })
      },
    })
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/products/${product.id}/edit?locale=${activeLocale}`,
            },
          ],
        },
        ...(isTranslationsEnabled
          ? [
              {
                actions: [
                  {
                    icon: <GlobeEurope />,
                    label: t("translations.actions.manage"),
                    to: `/settings/translations/edit?reference=product&reference_id=${product.id}`,
                  },
                ],
              },
            ]
          : []),
        {
          actions: [
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useColumns = (
  activeLocale: string,
  localeLookupKey?: string,
  translationsMap?: Record<string, Record<string, Record<string, string>>>
) => {
  const base = useProductTableColumns(activeLocale, localeLookupKey, translationsMap)

  const columns = useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <ProductActions product={row.original} activeLocale={activeLocale} />
        },
      }),
    ],
    [base, activeLocale]
  )

  return columns
}

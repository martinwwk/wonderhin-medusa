import { Button, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"

import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { _DataTable } from "../../../../../components/table/data-table"
import { useCollections } from "../../../../../hooks/api/collections"
import { useCollectionTableColumns } from "../../../../../hooks/table/columns/use-collection-table-columns"
import { useCollectionTableFilters } from "../../../../../hooks/table/filters"
import { useCollectionTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { CollectionRowActions } from "./collection-row-actions"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useReferenceTranslations } from "../../../../../hooks/api/translations"
import { useStore } from "../../../../../hooks/api/store"
import { languages } from "../../../../../i18n/languages"

const PAGE_SIZE = 20

export const CollectionListTable = () => {
  const { t } = useTranslation()
  const isTranslationsEnabled = useFeatureFlag("translation")
  const [activeLocale, setActiveLocale] = useState("en")

  // Fetch store locales
  const { store } = useStore()

  const { searchParams, raw } = useCollectionTableQuery({ pageSize: PAGE_SIZE })
  const { collections, count, isError, error, isLoading } = useCollections(
    {
      ...searchParams,
      fields: "+products.id",
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  // Fetch translations for all collections
  const { translations } = useReferenceTranslations(
    "product_collection",
    collections?.map((c) => c.id).filter(Boolean) || [],
    {
      enabled: isTranslationsEnabled && (collections?.length || 0) > 0,
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

  const filters = useCollectionTableFilters()
  const columns = useColumns(activeLocale, localeLookupKey, translationsMap)

  const { table } = useDataTable({
    data: collections ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row, index) => row.id ?? `${index}`,
    pageSize: PAGE_SIZE,
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
        <div>
          <Heading>{t("collections.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("collections.subtitle")}
          </Text>
        </div>
        <Link to="/collections/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <_DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        filters={filters}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "handle", label: t("fields.handle") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        search
        navigateTo={(row) => `/collections/${row.original.id}`}
        queryObject={raw}
        isLoading={isLoading}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminCollection>()

const useColumns = (
  activeLocale: string,
  localeLookupKey?: string,
  translationsMap?: Record<string, Record<string, Record<string, string>>>
) => {
  const base = useCollectionTableColumns(activeLocale, localeLookupKey, translationsMap)

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <CollectionRowActions collection={row.original} activeLocale={activeLocale} />
        ),
      }),
    ],
    [base, activeLocale]
  )
}

import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, StatusBadge, Text } from "@medusajs/ui"
import * as Tabs from "@radix-ui/react-tabs"
import { useTranslation } from "react-i18next"
import { useMemo, useState } from "react"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteProductCategoryAction } from "../../../common/hooks/use-delete-product-category-action"
import { getIsActiveProps, getIsInternalProps } from "../../../common/utils"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useReferenceTranslations } from "../../../../../hooks/api/translations"
import { useStore } from "../../../../../hooks/api/store"
import { languages } from "../../../../../i18n/languages"

type CategoryGeneralSectionProps = {
  category: HttpTypes.AdminProductCategory
}

export const CategoryGeneralSection = ({
  category,
}: CategoryGeneralSectionProps) => {
  const { t } = useTranslation()
  const isTranslationsEnabled = useFeatureFlag("translation")
  const [activeLocale, setActiveLocale] = useState("en")

  // Fetch store locales
  const { store } = useStore()

  // Fetch translations for this category
  const { translations } = useReferenceTranslations("product_category", category.id, {
    enabled: isTranslationsEnabled,
  })

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

  // Get translations map for current category
  const translationsMap = useMemo(() => {
    if (!translations) return {}
    const map: Record<string, Record<string, string>> = {}
    translations.forEach((tr: any) => {
      const locale = tr.locale_code
      if (!map[locale]) map[locale] = {}
      if (tr.translations) {
        map[locale] = {
          ...map[locale],
          ...tr.translations,
        }
      }
    })
    return map
  }, [translations])

  // Get name for active locale
  const getName = (locale: string) => {
    if (locale === "en") {
      return category.name
    }
    return translationsMap[locale]?.name || category.name
  }

  // Get description for active locale
  const getDescription = (locale: string) => {
    if (locale === "en") {
      return category.description || ""
    }
    return translationsMap[locale]?.description || ""
  }

  const activeProps = getIsActiveProps(category.is_active, t)
  const internalProps = getIsInternalProps(category.is_internal, t)

  const handleDelete = useDeleteProductCategoryAction(category)

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
        <Heading>{getName(activeLocale)}</Heading>
        <div className="flex items-center gap-x-4">
          <div className="flex items-center gap-x-2">
            <StatusBadge color={activeProps.color}>
              {activeProps.label}
            </StatusBadge>
            <StatusBadge color={internalProps.color}>
              {internalProps.label}
            </StatusBadge>
          </div>
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    icon: <PencilSquare />,
                    to: `edit?locale=${activeLocale}`,
                  },
                ],
              },
              ...(isTranslationsEnabled
                ? [
                    {
                      actions: [
                        {
                          label: t("translations.actions.manage"),
                          to: `/settings/translations/edit?reference=product_category&reference_id=${category.id}`,
                          icon: <GlobeEurope />,
                        },
                      ],
                    },
                  ]
                : []),
              {
                actions: [
                  {
                    label: t("actions.delete"),
                    icon: <Trash />,
                    onClick: handleDelete,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 gap-3 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.description")}
        </Text>
        <Text size="small" leading="compact">
          {getDescription(activeLocale) || "-"}
        </Text>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 gap-3 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.handle")}
        </Text>
        <Text size="small" leading="compact">
          /{category.handle}
        </Text>
      </div>
    </Container>
  )
}

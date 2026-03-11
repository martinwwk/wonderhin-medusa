import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, usePrompt } from "@medusajs/ui"
import * as Tabs from "@radix-ui/react-tabs"
import { useTranslation } from "react-i18next"
import { useMemo, useState } from "react"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { useDeleteCollection } from "../../../../../hooks/api/collections"
import { useNavigate } from "react-router-dom"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useReferenceTranslations } from "../../../../../hooks/api/translations"
import { useStore } from "../../../../../hooks/api/store"
import { languages } from "../../../../../i18n/languages"

type CollectionGeneralSectionProps = {
  collection: HttpTypes.AdminCollection
}

export const CollectionGeneralSection = ({
  collection,
}: CollectionGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const isTranslationsEnabled = useFeatureFlag("translation")
  const [activeLocale, setActiveLocale] = useState("en")

  // Fetch store locales
  const { store } = useStore()

  // Fetch translations for this collection
  const { translations } = useReferenceTranslations("product_collection", collection.id, {
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

  // Get translations map for current collection
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

  // Get title for active locale
  const getTitle = (locale: string) => {
    if (locale === "en") {
      return collection.title
    }
    return translationsMap[locale]?.title || collection.title
  }

  // Get description for active locale
  const getDescription = (locale: string) => {
    if (locale === "en") {
      return collection.description || ""
    }
    return translationsMap[locale]?.description || ""
  }

  const { mutateAsync } = useDeleteCollection(collection.id!)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("collections.deleteWarning", {
        count: 1,
        title: collection.title,
      }),
    })

    if (!res) {
      return
    }

    await mutateAsync()
    navigate("../", { replace: true })
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
        <Heading>{getTitle(activeLocale)}</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  icon: <PencilSquare />,
                  label: t("actions.edit"),
                  to: `/collections/${collection.id}/edit?locale=${activeLocale}`,
                  disabled: !collection.id,
                },
              ],
            },
            ...(isTranslationsEnabled
              ? [
                  {
                    actions: [
                      {
                        label: t("translations.actions.manage"),
                        to: `/settings/translations/edit?reference=product_collection&reference_id=${collection.id}`,
                        icon: <GlobeEurope />,
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
                  disabled: !collection.id,
                },
              ],
            },
          ]}
        />
      </div>
      {getDescription(activeLocale) && (
        <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
          <Text size="small" leading="compact" weight="plus">
            {t("fields.description")}
          </Text>
          <Text size="small">{getDescription(activeLocale)}</Text>
        </div>
      )}
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.handle")}
        </Text>
        <Text size="small">/{collection.handle}</Text>
      </div>
    </Container>
  )
}

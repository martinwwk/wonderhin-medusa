import { Component, GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Badge, Container, Heading, usePrompt } from "@medusajs/ui"
import * as Tabs from "@radix-ui/react-tabs"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"
import { useDeleteVariant } from "../../../../../hooks/api/products"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"
import { useReferenceTranslations } from "../../../../../hooks/api/translations"
import { useStore } from "../../../../../hooks/api/store"
import { languages } from "../../../../../i18n/languages"

type VariantGeneralSectionProps = {
  variant: HttpTypes.AdminProductVariant
}

export function VariantGeneralSection({ variant }: VariantGeneralSectionProps) {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const isTranslationsEnabled = useFeatureFlag("translation")
  const [activeLocale, setActiveLocale] = useState("en")

  // Fetch store locales
  const { store } = useStore()

  // Fetch translations for this variant
  const { translations } = useReferenceTranslations("product_variant", variant.id, {
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

  // Get translations map for current variant
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
      return variant.title
    }
    return translationsMap[locale]?.title || variant.title
  }

  // Get material for active locale
  const getMaterial = (locale: string) => {
    if (locale === "en") {
      return variant.material || ""
    }
    return translationsMap[locale]?.material || variant.material || ""
  }

  const hasInventoryKit = variant.inventory?.length > 1

  const { mutateAsync } = useDeleteVariant(variant.product_id!, variant.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("products.variant.deleteWarning", {
        title: getTitle(activeLocale),
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("..", { replace: true })
      },
    })
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
          <div className="flex items-center gap-2">
            <Heading>{getTitle(activeLocale)}</Heading>
            {hasInventoryKit && (
              <span className="text-ui-fg-muted font-normal">
                <Component />
              </span>
            )}
          </div>
          <span className="text-ui-fg-subtle txt-small mt-2">
            {t("labels.productVariant")}
          </span>
        </div>
        <div className="flex items-center gap-x-4">
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    label: t("actions.edit"),
                    to: `edit?locale=${activeLocale}`,
                    icon: <PencilSquare />,
                  },
                ],
              },
              ...(isTranslationsEnabled
                ? [
                    {
                      actions: [
                        {
                          label: t("translations.actions.manage"),
                          to: `/settings/translations/edit?reference=product_variant&reference_id=${variant.id}`,
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
                    onClick: handleDelete,
                    icon: <Trash />,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <SectionRow title={t("fields.sku")} value={variant.sku} />
      {getMaterial(activeLocale) && (
        <SectionRow title={t("fields.material")} value={getMaterial(activeLocale)} />
      )}
      {variant.options?.map((o) => (
        <SectionRow
          key={o.id}
          title={o.option?.title!}
          value={<Badge size="2xsmall">{o.value}</Badge>}
        />
      ))}
    </Container>
  )
}

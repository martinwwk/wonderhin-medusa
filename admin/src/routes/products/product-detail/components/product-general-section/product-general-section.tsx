import { GlobeEurope, PencilSquare, Trash } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, StatusBadge, toast, usePrompt } from "@medusajs/ui"
import * as Tabs from "@radix-ui/react-tabs"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { SectionRow } from "../../../../../components/common/section"
import { useDeleteProduct } from "../../../../../hooks/api/products"
import { useStore } from "../../../../../hooks/api/store"
import { useReferenceTranslations } from "../../../../../hooks/api/translations"
import { useExtension } from "../../../../../providers/extension-provider"
import { useFeatureFlag } from "../../../../../providers/feature-flag-provider"

const productStatusColor = (status: string) => {
  switch (status) { 
    case "draft":
      return "grey"
    case "proposed":
      return "orange"
    case "published":
      return "green"
    case "rejected":
      return "red"
    default:
      return "grey"
  }
}

type ProductGeneralSectionProps = {
  product: HttpTypes.AdminProduct
}

export const ProductGeneralSection = ({
  product,
}: ProductGeneralSectionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()
  const { getDisplays } = useExtension()
  const isTranslationsEnabled = useFeatureFlag("translation")
  const [activeLocale, setActiveLocale] = useState("en")

  // Fetch store locales
  const { store } = useStore()

  // Fetch translations for this product - use product.updatedAt as key to refetch after edits
  const { translations } = useReferenceTranslations("product", product.id, {
    enabled: isTranslationsEnabled,
  })

  // Get available locales sorted with English first
  const availableLocales = useMemo(() => {
    const locales = store?.supported_locales || []
    const enLocale = locales.find((l: any) => (l.locale_code || l.code) === "en")
    const otherLocales = locales.filter((l: any) => (l.locale_code || l.code) !== "en")
    return enLocale ? [enLocale, ...otherLocales] : otherLocales
  }, [store])

  // Get locale display name - use locale.locale.name for proper display
  const getLocaleName = (locale: any) => {
    const code = locale.locale_code || locale.code
    // Try locale.locale.name first (Medusa structure), then fallback to locale.name
    return locale.locale?.name || locale.name || (code === "en" ? "English" : code.toUpperCase())
  }

  // Get translations map for current product
  // Each translation entry has locale_code and translations object containing all field values
  const translationsMap = useMemo(() => {
    if (!translations) return {}
    const map: Record<string, Record<string, string>> = {}
    translations.forEach((tr: any) => {
      const locale = tr.locale_code
      if (!map[locale]) map[locale] = {}
      // tr.translations contains all fields: { title: "...", description: "...", subtitle: "...", material: "..." }
      if (tr.translations) {
        map[locale] = {
          ...map[locale],
          ...tr.translations,
        }
      }
    })
    return map
  }, [translations])

  // Get description for active locale
  const getDescription = (locale: string) => {
    if (locale === "en") {
      return product.description || ""
    }
    return translationsMap[locale]?.description || ""
  }

  // Get title for active locale
  const getTitle = (locale: string) => {
    if (locale === "en") {
      return product.title
    }
    return translationsMap[locale]?.title || product.title
  }

  // Get subtitle for active locale
  const getSubtitle = (locale: string) => {
    if (locale === "en") {
      return product.subtitle || ""
    }
    return translationsMap[locale]?.subtitle || product.subtitle || ""
  }

  // Get material for active locale
  const getMaterial = (locale: string) => {
    if (locale === "en") {
      return product.material || ""
    }
    return translationsMap[locale]?.material || product.material || ""
  }

  const displays = getDisplays("product", "general")

  const { mutateAsync } = useDeleteProduct(product.id)

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
        navigate("..")
      },
      onError: (e) => {
        toast.error(t("products.toasts.delete.error.header"), {
          description: e.message,
        })
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
        <Heading>{getTitle(activeLocale)}</Heading>
        <div className="flex items-center gap-x-4">
          <StatusBadge color={productStatusColor(product.status)}>
            {t(`products.productStatus.${product.status}`)}
          </StatusBadge>
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
                          to: `/settings/translations/edit?reference=product&reference_id=${product.id}`,
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

      <SectionRow title={t("fields.description")} value={getDescription(activeLocale)} />
      <SectionRow title={t("fields.subtitle")} value={getSubtitle(activeLocale)} />
      <SectionRow title={t("fields.handle")} value={`/${product.handle}`} />
      <SectionRow title={t("fields.material")} value={getMaterial(activeLocale)} />
      <SectionRow
        title={t("fields.discountable")}
        value={product.discountable ? t("fields.true") : t("fields.false")}
      />
      {displays.map((Component, index) => {
        return <Component key={index} data={product} />
      })}
    </Container>
  )
}

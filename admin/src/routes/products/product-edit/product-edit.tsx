import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"

import { RouteDrawer } from "../../../components/modals"
import { useProduct, useStore } from "../../../hooks/api"
import { EditProductForm } from "./components/edit-product-form"

export const ProductEdit = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const locale = searchParams.get("locale") || "en"
  const { t } = useTranslation()
  const { store } = useStore()

  // Get locale display name
  const localeName = (() => {
    if (locale === "en") return "English"
    const storeLocale = store?.supported_locales?.find(
      (l: any) => (l.locale_code || l.code) === locale
    )
    return (storeLocale as any)?.name || locale.toUpperCase()
  })()

  const { product, isLoading, isError, error } = useProduct(id!, {
    // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
    fields:
      "-type,-collection,-options,-tags,-images,-variants,-sales_channels",
  })

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>
            {locale === "en"
              ? t("products.edit.header")
              : `${t("products.edit.header")} (${localeName})`}
          </Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("products.edit.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {!isLoading && product && <EditProductForm product={product} locale={locale} />}
    </RouteDrawer>
  )
}

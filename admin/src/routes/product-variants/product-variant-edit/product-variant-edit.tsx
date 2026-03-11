import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useLoaderData, useParams, useSearchParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useProduct, useProductVariant } from "../../../hooks/api/products"
import { languages } from "../../../i18n/languages"
import { ProductEditVariantForm } from "./components/product-edit-variant-form"
import { editProductVariantLoader } from "./loader"

export const ProductVariantEdit = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof editProductVariantLoader>
  >

  const { t } = useTranslation()
  const { id, variant_id } = useParams()
  const [URLSearchParms] = useSearchParams()
  const searchVariantId = URLSearchParms.get("variant_id")
  const locale = URLSearchParms.get("locale") || "en"

  // Get locale display name from languages registry
  const localeName = (() => {
    if (locale === "en") return "English"
    const normalize = (c: string) => c.toLowerCase().replace(/[-_]/g, "")
    const lang = languages.find((l) => normalize(l.code) === normalize(locale))
    return lang?.display_name || locale.toUpperCase()
  })()

  const { variant, isPending, isError, error } = useProductVariant(
    id!,
    variant_id || searchVariantId!,
    undefined,
    {
      initialData,
    }
  )

  const {
    product,
    isPending: isProductPending,
    isError: isProductError,
    error: productError,
  } = useProduct(
    variant?.product_id!,
    {
      // TODO: Remove exclusion once we avoid including unnecessary relations by default in the query config
      fields: "-type,-collection,-tags,-images,-variants,-sales_channels",
    },
    {
      enabled: !!variant?.product_id,
    }
  )

  const ready = !isPending && !!variant && !isProductPending && !!product

  if (isError) {
    throw error
  }

  if (isProductError) {
    throw productError
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <Heading>
          {locale === "en"
            ? t("products.variant.edit.header")
            : `${t("products.variant.edit.header")} (${localeName})`}
        </Heading>
      </RouteDrawer.Header>
      {ready && <ProductEditVariantForm variant={variant} product={product} locale={locale} />}
    </RouteDrawer>
  )
}

import { Heading } from "@medusajs/ui"

import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useProductCategory } from "../../../hooks/api/categories"
import { languages } from "../../../i18n/languages"
import { EditCategoryForm } from "./components/edit-category-form"

export const CategoryEdit = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const locale = searchParams.get("locale") || "en"
  const { t } = useTranslation()

  // Get locale display name from languages registry
  const localeName = (() => {
    if (locale === "en") return "English"
    const normalize = (c: string) => c.toLowerCase().replace(/[-_]/g, "")
    const lang = languages.find((l) => normalize(l.code) === normalize(locale))
    return lang?.display_name || locale.toUpperCase()
  })()

  const { product_category, isPending, isError, error } = useProductCategory(
    id!
  )

  const ready = !isPending && !!product_category

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>
            {locale === "en"
              ? t("categories.edit.header")
              : `${t("categories.edit.header")} (${localeName})`}
          </Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("categories.edit.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ready && <EditCategoryForm category={product_category} locale={locale} />}
    </RouteDrawer>
  )
}

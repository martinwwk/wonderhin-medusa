import { Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router-dom"
import { RouteDrawer } from "../../../components/modals"
import { useCollection } from "../../../hooks/api/collections"
import { languages } from "../../../i18n/languages"
import { EditCollectionForm } from "./components/edit-collection-form"

export const CollectionEdit = () => {
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

  const { collection, isLoading, isError, error } = useCollection(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>
            {locale === "en"
              ? t("collections.editCollection")
              : `${t("collections.editCollection")} (${localeName})`}
          </Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("collections.editCollection")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {!isLoading && collection && (
        <EditCollectionForm collection={collection} locale={locale} />
      )}
    </RouteDrawer>
  )
}

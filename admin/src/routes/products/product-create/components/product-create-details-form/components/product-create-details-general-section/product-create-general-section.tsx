import { Input } from "@medusajs/ui"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"

import { Form } from "../../../../../../../components/common/form"
import { LocalizedDescription } from "../../../../../../../components/common/localized-description"
import { HandleInput } from "../../../../../../../components/inputs/handle-input"
import { useStore } from "../../../../../../../hooks/api"
import { ProductCreateSchemaType } from "../../../../types"

type ProductCreateGeneralSectionProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateGeneralSection = ({
  form,
}: ProductCreateGeneralSectionProps) => {
  const { t } = useTranslation()

  // Fetch store locales
  const { store } = useStore()

  // Get available locales
  const availableLocales = useMemo(() => {
    return store?.supported_locales?.map((locale: any) => ({
      code: locale.locale_code || locale.code,
      name: locale.name || locale.locale_code?.toUpperCase() || "Unknown",
    })) || [{ code: "en", name: "English" }]
  }, [store])

  return (
    <div id="general" className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Form.Field
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>{t("products.fields.title.label")}</Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder={t("products.fields.title.placeholder")} />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="subtitle"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label optional>
                    {t("products.fields.subtitle.label")}
                  </Form.Label>
                  <Form.Control>
                    <Input {...field} placeholder={t("products.fields.subtitle.placeholder")} />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="handle"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label
                    tooltip={t("products.fields.handle.tooltip")}
                    optional
                  >
                    {t("fields.handle")}
                  </Form.Label>
                  <Form.Control>
                    <HandleInput {...field} placeholder={t("products.fields.handle.placeholder")} />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
        </div>
      </div>
      <LocalizedDescription
        control={form.control}
        name="description"
        availableLocales={availableLocales}
        label={t("products.fields.description.label")}
        placeholder={t("products.fields.description.placeholder")}
      />
    </div>
  )
}

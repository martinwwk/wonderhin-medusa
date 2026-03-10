import { Button, Input, Select, Text, Textarea, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { HttpTypes } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useExtendableForm } from "../../../../../dashboard-app/forms/hooks"
import { useStore, useUpdateProduct } from "../../../../../hooks/api"
import { useReferenceTranslations, useBatchTranslations } from "../../../../../hooks/api/translations"
import { transformNullableFormData } from "../../../../../lib/form-helpers"

import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { FormExtensionZone } from "../../../../../dashboard-app"
import { useExtension } from "../../../../../providers/extension-provider"
import { useDocumentDirection } from "../../../../../hooks/use-document-direction"
import { useMemo } from "react"

type EditProductFormProps = {
  product: HttpTypes.AdminProduct
  locale?: string
}

const EditProductSchema = zod.object({
  status: zod.enum(["draft", "published", "proposed", "rejected"]),
  title: zod.string().min(1),
  subtitle: zod.string().optional(),
  handle: zod.string().min(1),
  material: zod.string().optional(),
  description: zod.string().optional(),
  discountable: zod.boolean(),
})

export const EditProductForm = ({ product, locale = "en" }: EditProductFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const direction = useDocumentDirection()
  const { getFormFields, getFormConfigs } = useExtension()
  const fields = getFormFields("product", "edit")
  const configs = getFormConfigs("product", "edit")

  // Fetch store locales
  const { store } = useStore()

  // Get locale name for display
  const localeName = useMemo(() => {
    if (locale === "en") return "English"
    const storeLocale = store?.supported_locales?.find((l: any) => (l.locale_code || l.code) === locale)
    return (storeLocale as any)?.name || locale.toUpperCase()
  }, [store, locale])

  // Fetch existing translations for this product
  const { translations: existingTranslations } = useReferenceTranslations(
    "product",
    product.id
  )

  // Get description for the current locale
  const descriptionForLocale = useMemo(() => {
    if (locale === "en") {
      return product.description || ""
    }
    // Find translation for this locale - use locale_code not locale
    const translation = existingTranslations?.find(
      (tr: any) => (tr as any).field === "description" && (tr as any).locale_code === locale
    )
    return (translation as any)?.value || ""
  }, [product.description, existingTranslations, locale])

  // Get title for the current locale
  const titleForLocale = useMemo(() => {
    if (locale === "en") {
      return product.title
    }
    const translation = existingTranslations?.find(
      (tr: any) => (tr as any).field === "title" && (tr as any).locale_code === locale
    )
    return (translation as any)?.value || product.title
  }, [product.title, existingTranslations, locale])

  const form = useExtendableForm({
    defaultValues: {
      status: product.status,
      title: titleForLocale,
      material: product.material || "",
      subtitle: product.subtitle || "",
      handle: product.handle || "",
      description: descriptionForLocale,
      discountable: product.discountable,
    },
    schema: EditProductSchema,
    configs: configs,
    data: product,
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id)
  const batchTranslations = useBatchTranslations("product")

  const handleSubmit = form.handleSubmit(async (data) => {
    const { title, discountable, handle, status, description, ...optional } = data

    if (locale === "en") {
      // For English, save directly to product
      const nullableData = transformNullableFormData({
        ...optional,
        description,
      })

      await mutateAsync(
        {
          title,
          discountable,
          handle,
          status: status as HttpTypes.AdminProductStatus,
          ...nullableData,
        },
        {
          onSuccess: ({ product }) => {
            toast.success(
              t("products.edit.successToast", { title: product.title })
            )
            handleSuccess()
          },
          onError: (e) => {
            toast.error(e.message)
          },
        }
      )
    } else {
      // For other locales, save to product first, then save translation
      const nullableData = transformNullableFormData(optional)

      await mutateAsync(
        {
          title,
          discountable,
          handle,
          status: status as HttpTypes.AdminProductStatus,
          ...nullableData,
        },
        {
          onSuccess: async ({ product }) => {
            // Save translation for this locale
            await batchTranslations.mutateAsync({
              update: [
                {
                  reference_id: product.id,
                  reference: "product",
                  locale: locale,
                  field: "description",
                  value: description || "",
                },
              ],
            } as any)
            toast.success(
              t("products.edit.successToast", { title: product.title })
            )
            handleSuccess()
          },
          onError: (e) => {
            toast.error(e.message)
          },
        }
      )
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <div className="flex flex-col gap-y-8">
            <div className="flex flex-col gap-y-4">
              <Form.Field
                control={form.control}
                name="status"
                render={({ field: { onChange, ref, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.status")}</Form.Label>
                      <Form.Control>
                        <Select
                          dir={direction}
                          {...field}
                          onValueChange={onChange}
                        >
                          <Select.Trigger ref={ref}>
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            {(
                              [
                                "draft",
                                "published",
                                "proposed",
                                "rejected",
                              ] as const
                            ).map((status) => {
                              return (
                                <Select.Item key={status} value={status}>
                                  {t(`products.productStatus.${status}`)}
                                </Select.Item>
                              )
                            })}
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="title"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.title")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
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
                      <Form.Label optional>{t("fields.subtitle")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
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
                      <Form.Label>{t("fields.handle")}</Form.Label>
                      <Form.Control>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center border-r">
                            <Text
                              className="text-ui-fg-muted"
                              size="small"
                              leading="compact"
                              weight="plus"
                            >
                              /
                            </Text>
                          </div>
                          <Input {...field} className="pl-10" />
                        </div>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="material"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>{t("fields.material")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label optional>
                        {t("fields.description")} ({localeName})
                      </Form.Label>
                      <Form.Control>
                        <Textarea {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
            <SwitchBox
              control={form.control}
              name="discountable"
              label={t("fields.discountable")}
              description={t("products.discountableHint")}
            />
            <FormExtensionZone fields={fields} form={form} />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}

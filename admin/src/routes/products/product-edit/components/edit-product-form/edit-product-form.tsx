import { Button, Input, Select, Text, Textarea, toast } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { HttpTypes } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { SwitchBox } from "../../../../../components/common/switch-box"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useExtendableForm } from "../../../../../dashboard-app/forms/hooks"
import { useStore, useUpdateProduct } from "../../../../../hooks/api"
import { useReferenceTranslations, useBatchTranslations, translationEntitiesQueryKeys } from "../../../../../hooks/api/translations"
import { transformNullableFormData } from "../../../../../lib/form-helpers"
import { queryClient } from "../../../../../lib/query-client"

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
    product.id,
    {
      enabled: locale !== "en", // Only fetch if not English
    }
  )

  // Build translations map for current product
  const translationsMap = useMemo(() => {
    if (!existingTranslations) return {}
    const map: Record<string, Record<string, string>> = {}
    existingTranslations.forEach((tr: any) => {
      const trLocale = tr.locale_code
      if (!map[trLocale]) map[trLocale] = {}
      if (tr.translations) {
        map[trLocale] = {
          ...map[trLocale],
          ...tr.translations,
        }
      }
    })
    return map
  }, [existingTranslations])

  // Get description for the current locale
  const descriptionForLocale = useMemo(() => {
    if (locale === "en") {
      return product.description || ""
    }
    return translationsMap[locale]?.description || ""
  }, [product.description, translationsMap, locale])

  // Get title for the current locale
  const titleForLocale = useMemo(() => {
    if (locale === "en") {
      return product.title
    }
    return translationsMap[locale]?.title || product.title
  }, [product.title, translationsMap, locale])

  // Get subtitle for the current locale
  const subtitleForLocale = useMemo(() => {
    if (locale === "en") {
      return product.subtitle || ""
    }
    return translationsMap[locale]?.subtitle || product.subtitle || ""
  }, [product.subtitle, translationsMap, locale])

  // Get material for the current locale
  const materialForLocale = useMemo(() => {
    if (locale === "en") {
      return product.material || ""
    }
    return translationsMap[locale]?.material || product.material || ""
  }, [product.material, translationsMap, locale])

  const form = useExtendableForm({
    defaultValues: {
      status: product.status,
      title: titleForLocale,
      material: materialForLocale,
      subtitle: subtitleForLocale,
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
    const { title, discountable, handle, status, description, subtitle, material } = data

    if (locale === "en") {
      // For English, save directly to product
      const nullableData = transformNullableFormData({
        subtitle,
        material,
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
            // Invalidate translations queries to refetch updated data
            queryClient.invalidateQueries({
              queryKey: translationEntitiesQueryKeys.list({ type: "product", id: product.id }),
            })
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
      // For other locales, save base product data first, then save translations
      // For non-English, we don't update the base title/subtitle/material - only description gets translated
      const baseNullableData = transformNullableFormData({
        subtitle,
        material,
      })

      await mutateAsync(
        {
          // Keep original English title, handle, etc.
          discountable,
          handle,
          status: status as HttpTypes.AdminProductStatus,
          ...baseNullableData,
        },
        {
          onSuccess: async ({ product }) => {
            // Save translations for this locale
            const translationsPayload: Record<string, string> = {}
            if (title) translationsPayload.title = title
            if (description) translationsPayload.description = description
            if (subtitle) translationsPayload.subtitle = subtitle
            if (material) translationsPayload.material = material

            // Check if translation already exists
            const existingTranslation = existingTranslations?.find(
              (tr: any) => tr.locale_code === locale
            )

            if (existingTranslation?.id) {
              // Update existing translation
              await batchTranslations.mutateAsync({
                update: [
                  {
                    id: existingTranslation.id,
                    translations: translationsPayload,
                  },
                ],
              })
            } else {
              // Create new translation
              await batchTranslations.mutateAsync({
                create: [
                  {
                    reference_id: product.id,
                    reference: "product",
                    locale_code: locale,
                    translations: translationsPayload,
                  },
                ],
              })
            }

            // Invalidate translations queries to refetch updated data
            queryClient.invalidateQueries({
              queryKey: translationEntitiesQueryKeys.list({ type: "product", id: product.id }),
            })

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

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Select, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { useMemo } from "react"

import { HttpTypes } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { HandleInput } from "../../../../../components/inputs/handle-input"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateProductCategory } from "../../../../../hooks/api/categories"
import { useDocumentDirection } from "../../../../../hooks/use-document-direction"
import { useStore, useReferenceTranslations, useBatchTranslations } from "../../../../../hooks/api"
import { queryClient } from "../../../../../lib/query-client"
import { translationEntitiesQueryKeys } from "../../../../../hooks/api/translations"

const EditCategorySchema = z.object({
  name: z.string().min(1),
  handle: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  visibility: z.enum(["public", "internal"]),
})

type EditCategoryFormProps = {
  category: HttpTypes.AdminProductCategory
  locale?: string
}

export const EditCategoryForm = ({ category, locale = "en" }: EditCategoryFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const direction = useDocumentDirection()

  // Fetch store locales
  const { store } = useStore()

  // Get locale name for display
  const localeName = useMemo(() => {
    if (locale === "en") return "English"
    const storeLocale = store?.supported_locales?.find((l: any) => (l.locale_code || l.code) === locale)
    return (storeLocale as any)?.name || locale.toUpperCase()
  }, [store, locale])

  // Fetch existing translations for this category
  const { translations: existingTranslations } = useReferenceTranslations(
    "product_category",
    category.id,
    {
      enabled: locale !== "en",
    }
  )

  // Build translations map for current category
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

  // Get name for the current locale
  const nameForLocale = useMemo(() => {
    if (locale === "en") {
      return category.name
    }
    return translationsMap[locale]?.name || category.name
  }, [category.name, translationsMap, locale])

  // Get description for the current locale
  const descriptionForLocale = useMemo(() => {
    if (locale === "en") {
      return category.description || ""
    }
    return translationsMap[locale]?.description || ""
  }, [category.description, translationsMap, locale])

  const form = useForm<z.infer<typeof EditCategorySchema>>({
    defaultValues: {
      name: nameForLocale,
      handle: category.handle,
      description: descriptionForLocale,
      status: category.is_active ? "active" : "inactive",
      visibility: category.is_internal ? "internal" : "public",
    },
    resolver: zodResolver(EditCategorySchema),
  })

  const { mutateAsync, isPending } = useUpdateProductCategory(category.id)
  const batchTranslations = useBatchTranslations("product_category")

  const handleSubmit = form.handleSubmit(async (data) => {
    const { name, handle, description, status, visibility } = data

    if (locale === "en") {
      // For English, save directly to category
      await mutateAsync(
        {
          name,
          description,
          handle,
          is_active: status === "active",
          is_internal: visibility === "internal",
        },
        {
          onSuccess: () => {
            toast.success(t("categories.edit.successToast"))
            handleSuccess()
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      )
    } else {
      // For other locales, save base category data first, then save translations
      await mutateAsync(
        {
          // Keep original English name
          name: category.name,
          handle,
          is_active: status === "active",
          is_internal: visibility === "internal",
        },
        {
          onSuccess: async ({ product_category }) => {
            // Save translations for this locale
            const translationsPayload: Record<string, string> = {}
            if (name) translationsPayload.name = name
            if (description) translationsPayload.description = description

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
                    reference_id: product_category.id,
                    reference: "product_category",
                    locale_code: locale,
                    translations: translationsPayload,
                  },
                ],
              })
            }

            // Invalidate translations queries to refetch updated data
            queryClient.invalidateQueries({
              queryKey: translationEntitiesQueryKeys.list({ type: "product_category", id: product_category.id }),
            })

            toast.success(t("categories.edit.successToast"))
            handleSuccess()
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      )
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.title")}</Form.Label>
                    <Form.Control>
                      <Input autoComplete="off" {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            {locale !== "en" && (
              <div className="text-ui-fg-subtle bg-ui-bg-subtle border-ui-border-base rounded-md px-3 py-2 text-sm">
                {t("categories.edit.hint", { locale: localeName })}
              </div>
            )}
            <Form.Field
              control={form.control}
              name="handle"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label
                      optional
                      tooltip={t("collections.handleTooltip")}
                    >
                      {t("fields.handle")}
                    </Form.Label>
                    <Form.Control>
                      <HandleInput {...field} />
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
                    <Form.Label optional>{t("fields.description")}</Form.Label>
                    <Form.Control>
                      <Textarea {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Form.Field
                control={form.control}
                name="status"
                render={({ field: { ref, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("categories.fields.status.label")}
                      </Form.Label>
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
                            <Select.Item value="active">
                              {t("categories.fields.status.active")}
                            </Select.Item>
                            <Select.Item value="inactive">
                              {t("categories.fields.status.inactive")}
                            </Select.Item>
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
                name="visibility"
                render={({ field: { ref, onChange, ...field } }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("categories.fields.visibility.label")}
                      </Form.Label>
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
                            <Select.Item value="public">
                              {t("categories.fields.visibility.public")}
                            </Select.Item>
                            <Select.Item value="internal">
                              {t("categories.fields.visibility.internal")}
                            </Select.Item>
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center gap-x-2">
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

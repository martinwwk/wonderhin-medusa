import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Input, Text, Textarea, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"
import { useMemo } from "react"

import { HttpTypes } from "@medusajs/types"
import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdateCollection } from "../../../../../hooks/api/collections"
import { useStore, useReferenceTranslations, useBatchTranslations } from "../../../../../hooks/api"
import { transformNullableFormData } from "../../../../../lib/form-helpers"
import { queryClient } from "../../../../../lib/query-client"
import { translationEntitiesQueryKeys } from "../../../../../hooks/api/translations"

type EditCollectionFormProps = {
  collection: HttpTypes.AdminCollection
  locale?: string
}

const EditCollectionSchema = zod.object({
  title: zod.string().min(1),
  handle: zod.string().min(1),
  description: zod.string().optional(),
})

export const EditCollectionForm = ({ collection, locale = "en" }: EditCollectionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  // Fetch store locales
  const { store } = useStore()

  // Get locale name for display
  const localeName = useMemo(() => {
    if (locale === "en") return "English"
    const storeLocale = store?.supported_locales?.find((l: any) => (l.locale_code || l.code) === locale)
    return (storeLocale as any)?.name || locale.toUpperCase()
  }, [store, locale])

  // Fetch existing translations for this collection
  const { translations: existingTranslations } = useReferenceTranslations(
    "product_collection",
    collection.id,
    {
      enabled: locale !== "en",
    }
  )

  // Build translations map for current collection
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

  // Get title for the current locale
  const titleForLocale = useMemo(() => {
    if (locale === "en") {
      return collection.title
    }
    return translationsMap[locale]?.title || collection.title
  }, [collection.title, translationsMap, locale])

  // Get description for the current locale
  const descriptionForLocale = useMemo(() => {
    if (locale === "en") {
      return collection.description || ""
    }
    return translationsMap[locale]?.description || ""
  }, [collection.description, translationsMap, locale])

  const form = useForm<zod.infer<typeof EditCollectionSchema>>({
    defaultValues: {
      title: titleForLocale,
      handle: collection.handle,
      description: descriptionForLocale,
    },
    resolver: zodResolver(EditCollectionSchema),
  })

  const { mutateAsync, isPending } = useUpdateCollection(collection.id)
  const batchTranslations = useBatchTranslations("product_collection")

  const handleSubmit = form.handleSubmit(async (data) => {
    const { title, handle, description } = data

    if (locale === "en") {
      // For English, save directly to collection
      const nullableData = transformNullableFormData({
        description,
      })

      await mutateAsync(
        {
          title,
          handle,
          ...nullableData,
        },
        {
          onSuccess: ({ collection }) => {
            // Invalidate translations queries to refetch updated data
            queryClient.invalidateQueries({
              queryKey: translationEntitiesQueryKeys.list({ type: "product_collection", id: collection.id }),
            })
            toast.success(
              t("collections.edit.successToast", { title: collection.title })
            )
            handleSuccess()
          },
          onError: (e) => {
            toast.error(e.message)
          },
        }
      )
    } else {
      // For other locales, save base collection data first, then save translations
      // For non-English, we don't update the base title - only description gets translated
      await mutateAsync(
        {
          // Keep original English title
          title: collection.title,
          handle,
        },
        {
          onSuccess: async ({ collection }) => {
            // Save translations for this locale
            const translationsPayload: Record<string, string> = {}
            if (title) translationsPayload.title = title
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
                    reference_id: collection.id,
                    reference: "product_collection",
                    locale_code: locale,
                    translations: translationsPayload,
                  },
                ],
              })
            }

            // Invalidate translations queries to refetch updated data
            queryClient.invalidateQueries({
              queryKey: translationEntitiesQueryKeys.list({ type: "product_collection", id: collection.id }),
            })

            toast.success(
              t("collections.edit.successToast", { title: collection.title })
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
      <KeyboundForm onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <RouteDrawer.Body>
          <div className="flex flex-col gap-y-4">
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
            {locale !== "en" && (
              <div className="text-ui-fg-subtle bg-ui-bg-subtle border-ui-border-base rounded-md px-3 py-2 text-sm">
                {t("collections.edit.hint", { locale: localeName })}
              </div>
            )}
            <Form.Field
              control={form.control}
              name="handle"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label tooltip={t("collections.handleTooltip")}>
                      {t("fields.handle")}
                    </Form.Label>
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

"use client"

import { Tabs, Textarea } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { Form } from "../form"
import { useMemo, useState } from "react"

type LocaleDescription = {
  locale: string
  value: string
}

type LocalizedDescriptionProps = {
  control: any
  name: string
  availableLocales: { code: string; name: string }[]
  translations?: LocaleDescription[]
  defaultValue?: string
  label?: string
  placeholder?: string
}

export const LocalizedDescription = ({
  control,
  name,
  availableLocales,
  translations = [],
  defaultValue = "",
  label,
  placeholder,
}: LocalizedDescriptionProps) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("en")

  // Build locale list with English first
  const sortedLocales = useMemo(() => {
    const enLocale = availableLocales.find((l) => l.code === "en")
    const otherLocales = availableLocales.filter((l) => l.code !== "en")
    return enLocale ? [enLocale, ...otherLocales] : otherLocales
  }, [availableLocales])

  // Get translation value for a locale
  const getTranslationValue = (locale: string): string => {
    if (locale === "en") {
      return defaultValue
    }
    const translation = translations.find((tr) => tr.locale === locale)
    return translation?.value || ""
  }

  // Build field values for each locale
  const localeFields = useMemo(() => {
    return sortedLocales.map((locale) => ({
      locale: locale.code,
      name: locale.name,
      value: getTranslationValue(locale.code),
    }))
  }, [sortedLocales, translations, defaultValue])

  return (
    <Form.Field
      control={control}
      name={name}
      render={({ field: { onChange, value, ...field } }: { field: { onChange: (value: Record<string, string>) => void; value?: Record<string, string>; [key: string]: any } }) => {
        // Value is an object with locale keys
        const currentValue = value || {}

        const handleLocaleChange = (locale: string, newValue: string) => {
          onChange({
            ...currentValue,
            [locale]: newValue,
          })
        }

        return (
          <Form.Item>
            <Form.Label optional>{label || t("fields.description")}</Form.Label>
            <Form.Control>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <Tabs.List className="w-full justify-start border-b px-0">
                  {localeFields.map((localeField) => (
                    <Tabs.Trigger
                      key={localeField.locale}
                      value={localeField.locale}
                      className="px-3"
                    >
                      {localeField.name || localeField.locale.toUpperCase()}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                {localeFields.map((localeField) => (
                  <Tabs.Content key={localeField.locale} value={localeField.locale}>
                    <Textarea
                      {...field}
                      value={currentValue[localeField.locale] ?? localeField.value}
                      onChange={(e) =>
                        handleLocaleChange(localeField.locale, e.target.value)
                      }
                      placeholder={placeholder}
                      className="mt-2"
                    />
                  </Tabs.Content>
                ))}
              </Tabs>
            </Form.Control>
            <Form.ErrorMessage />
          </Form.Item>
        )
      }}
    />
  )
}

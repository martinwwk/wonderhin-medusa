"use client"

import { useClientTranslation } from "@lib/i18n"

export default function StoreTitle() {
  const { t } = useClientTranslation()
  
  return (
    <h1 data-testid="store-page-title">{t('allProducts')}</h1>
  )
}

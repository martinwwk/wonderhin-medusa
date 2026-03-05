import { useState, useEffect } from "react"
import { listCategoriesClient } from "@/lib/data/categories-client"
import { translateCategoryName } from "@/lib/util/translate-category"

const CACHE_KEY = "medusa_categories_cache"
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface CachedCategories {
  timestamp: number
  // slug → English name (original)
  slugToName: Record<string, string>
}

/**
 * Reads the category slug→name map from localStorage if still fresh.
 */
function readCache(): CachedCategories | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed: CachedCategories = JSON.parse(raw)
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(slugToName: Record<string, string>): void {
  if (typeof window === "undefined") return
  try {
    const data: CachedCategories = { timestamp: Date.now(), slugToName }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // ignore storage errors
  }
}

/**
 * Returns a function that maps a category slug to a translated display name,
 * backed by Medusa API and localStorage cache.
 *
 * Usage:
 *   const { resolveSlug } = useCategoryMap(locale)
 *   resolveSlug('bags') // → '包包' when locale is 'zh-TW'
 */
export function useCategoryMap(locale: string) {
  const [slugToName, setSlugToName] = useState<Record<string, string>>(() => {
    const cached = readCache()
    return cached?.slugToName ?? {}
  })

  useEffect(() => {
    const cached = readCache()
    if (cached) {
      // Already populated from initial state; nothing to do
      setSlugToName(cached.slugToName)
      return
    }

    // Fetch all categories (flat list) and build slug→name map
    listCategoriesClient({ limit: 200 })
      .then((categories) => {
        const map: Record<string, string> = {}
        for (const cat of categories) {
          if (cat.handle && cat.name) {
            map[cat.handle] = cat.name
          }
        }
        writeCache(map)
        setSlugToName(map)
      })
      .catch(() => {
        // Silently fail – breadcrumb will fall back to slug-based label
      })
  }, [])

  const resolveSlug = (slug: string): string => {
    const name = slugToName[slug]
    if (!name) return slug
    return translateCategoryName(name, locale)
  }

  return { resolveSlug, slugToName }
}

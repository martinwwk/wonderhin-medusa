import { getLocaleHeader } from "@lib/util/get-locale-header"
import Medusa, { FetchArgs, FetchInput } from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
let MEDUSA_BACKEND_URL = "http://localhost:9000"

if (process.env.MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

const originalFetch = sdk.client.fetch.bind(sdk.client)

sdk.client.fetch = async <T>(
  input: FetchInput,
  init?: FetchArgs
): Promise<T> => {
  const headers = init?.headers ?? {}
  let localeHeader: Record<string, string | null> | undefined
  let currentLocale = 'en'
  
  try {
    localeHeader = await getLocaleHeader()
    // Always set x-medusa-locale header with the mapped locale value
    if (localeHeader["x-medusa-locale"]) {
      headers["x-medusa-locale"] = localeHeader["x-medusa-locale"]
      currentLocale = localeHeader["x-medusa-locale"]
    }
  } catch {}

  // Always include publishable key from env
  if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
    headers["x-publishable-api-key"] = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
  }

  const newHeaders = {
    ...headers,
  }
  
  // Add locale to cache tags for proper revalidation
  const nextConfig = init?.next || {}
  if (nextConfig.tags) {
    nextConfig.tags = [...nextConfig.tags, `locale-${currentLocale}`]
  } else if (nextConfig.tags === undefined) {
    nextConfig.tags = [`locale-${currentLocale}`]
  }
  
  init = {
    ...init,
    headers: newHeaders,
    next: nextConfig,
  }
  
  return originalFetch(input, init)
}

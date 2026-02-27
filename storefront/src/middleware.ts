import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en"

type Locale = {
  code: string
  name: string
}

const localeCache = {
  locales: [] as Locale[],
  localeSet: new Set<string>(),
  localeMap: new Map<string, string>(), // lowercase -> original case
  localesUpdated: Date.now(),
}

async function getLocales(cacheId: string) {
  const { locales, localeSet, localeMap, localesUpdated } = localeCache

  if (!BACKEND_URL) {
    throw new Error(
      "Middleware.ts: Error fetching locales. Did you set up locales in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable?"
    )
  }

  if (
    !locales.length ||
    localesUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch locales from Medusa
    const { locales: fetchedLocales } = await fetch(`${BACKEND_URL}/store/locales`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`locales-${cacheId}`],
      },
      cache: "force-cache",
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    }).catch(() => ({ locales: [] }))

    // Always include 'en' as default locale for base data
    const localesWithDefault = fetchedLocales?.length ? fetchedLocales : []
    const hasEnLocale = localesWithDefault.some((l: Locale) => l.code.toLowerCase() === 'en')
    
    if (!hasEnLocale) {
      localesWithDefault.unshift({ code: 'en', name: 'English' })
    }
    
    localeCache.locales = localesWithDefault
    localeCache.localeSet = new Set(localesWithDefault.map((l: Locale) => l.code.toLowerCase()))
    
    // Create mapping from lowercase to original case
    localeCache.localeMap.clear()
    localesWithDefault.forEach((l: Locale) => {
      localeCache.localeMap.set(l.code.toLowerCase(), l.code)
    })

    localeCache.localesUpdated = Date.now()
  }

  return { locales: localeCache.locales, localeSet: localeCache.localeSet, localeMap: localeCache.localeMap }
}

/**Determines the locale to use based on the URL, cookie, or default.
 */
async function getLocaleCode(
  request: NextRequest,
  localeSet: Set<string>,
  localeMap: Map<string, string>
) {
  try {
    let localeCodeLower

    const urlLocaleCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
    const cookieLocale = request.cookies.get("_medusa_locale")?.value?.toLowerCase()

    if (urlLocaleCode && localeSet.has(urlLocaleCode)) {
      localeCodeLower = urlLocaleCode
    } else if (cookieLocale && localeSet.has(cookieLocale)) {
      localeCodeLower = cookieLocale
    } else if (localeSet.has(DEFAULT_LOCALE.toLowerCase())) {
      localeCodeLower = DEFAULT_LOCALE.toLowerCase()
    } else {
      localeCodeLower = Array.from(localeSet)[0]
    }

    // Return original case from map
    return localeMap.get(localeCodeLower) || localeCodeLower
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the locale code. Did you set up locales in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

/**
 * Middleware to handle locale selection.
 */
export async function middleware(request: NextRequest) {
  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")

  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const { locales, localeSet, localeMap } = await getLocales(cacheId)

  const localeCode = await getLocaleCode(request, localeSet, localeMap)

  // Check if the URL already contains a valid locale code
  const urlLocaleCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  const urlHasValidLocale = urlLocaleCode && localeSet.has(urlLocaleCode)

  // if a valid locale is in the url and the cache id is set, update locale cookie and return next
  if (urlHasValidLocale && cacheIdCookie) {
    response = NextResponse.next()
    response.cookies.set("_medusa_locale", urlLocaleCode, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    // Add pathname header for server components
    response.headers.set("x-pathname", request.nextUrl.pathname)
    return response
  }

  // if a valid locale is in the url and the cache id is not set, set both cookies and continue
  if (urlHasValidLocale && !cacheIdCookie) {
    response = NextResponse.next()
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    response.cookies.set("_medusa_locale", urlLocaleCode, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    // Add pathname header for server components
    response.headers.set("x-pathname", request.nextUrl.pathname)
    return response
  }

  // check if the url is a static asset
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  // If URL has an invalid locale code, strip it from the path
  const redirectPath = urlHasValidLocale
    ? request.nextUrl.pathname
    : request.nextUrl.pathname === "/"
    ? ""
    : urlLocaleCode && !localeSet.has(urlLocaleCode)
    ? request.nextUrl.pathname.substring(urlLocaleCode.length + 1)
    : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  // If no valid locale is in URL, redirect to the locale from cookie or default
  if (!urlHasValidLocale && localeCode) {
    redirectUrl = `${request.nextUrl.origin}/${localeCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
    response.cookies.set("_medusa_locale", localeCode, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
  } else if (!urlHasValidLocale && !localeCode) {
    // Handle case where no valid locale exists
    return new NextResponse(
      "No valid locales configured. Please set up locales in your Medusa Admin.",
      { status: 500 }
    )
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}

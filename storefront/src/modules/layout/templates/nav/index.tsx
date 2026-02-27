"use client"


import { Suspense, useEffect, useState } from "react"
import { User, ShoppingCart } from "@medusajs/icons"
import { HiMenu } from "react-icons/hi"
import Image from "next/image"
import { listRegions } from "@lib/data/regions"
import { listLocales, Locale } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import TopMenu from "@modules/layout/components/side-menu"
import LeftDrawer from "@modules/layout/components/left-drawer"
import LocaleSelector from "@modules/layout/components/locale-selector"
import CurrencySelector from "@modules/layout/components/currency-selector"
import { useI18n } from "@lib/hooks/use-i18n"

type NavProps = {
  categories?: HttpTypes.StoreProductCategory[]
}

export default function Nav({ categories = [] }: NavProps) {
  const { t } = useI18n()
  const [regions, setRegions] = useState<StoreRegion[] | null>(null)
  const [locales, setLocales] = useState<Locale[] | null>(null)
  const [currentLocale, setCurrentLocale] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedRegions, fetchedLocales, fetchedLocale] = await Promise.all([
        listRegions().then((regions: StoreRegion[]) => regions),
        listLocales(),
        getLocale(),
      ])

      // Always inject 'en' as default locale if missing
      let localesWithDefault = fetchedLocales || []
      if (!localesWithDefault.find(l => l.code === "en")) {
        localesWithDefault = [
          { code: "en", name: "English" },
          ...localesWithDefault,
        ]
      }

      setRegions(fetchedRegions)
      setLocales(localesWithDefault)
      setCurrentLocale(fetchedLocale)
    }

    fetchData()
  }, [])

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* Top notification bar */}
      <div className="bg-black text-white py-2 text-center text-sm">
        Today: 30% off site-wide with code: ALL30+ FREE U.S Shipping & Returns*
      </div>

      <header className="relative mx-auto border-b duration-200 bg-white border-ui-border-base">
        {/* Main menu bar */}
        <div className="content-container flex items-center justify-between w-full h-16 px-4">
          {/* Logo on the left */}
          <LocalizedClientLink
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            data-testid="nav-store-link"
          >
            <Image
              src="/wonderhin-logo.png"
              alt="Wonderhin"
              width={140}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </LocalizedClientLink>

          {/* Center menu - desktop only */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            {regions && locales && currentLocale && (
              <TopMenu 
                regions={regions} 
                locales={locales} 
                currentLocale={currentLocale}
                categories={categories}
              />
            )}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-x-4">
            {/* Desktop icons with locale selector */}
            <div className="hidden md:flex items-center gap-x-4">
              {/* Currency selector */}
              {regions && <CurrencySelector regions={regions} />}
              {/* Locale selector */}
              {locales && currentLocale && (
                <LocaleSelector locales={locales} currentLocale={currentLocale} />
              )}
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex items-center"
                href="/account"
                data-testid="nav-account-link"
              >
                <User className="w-5 h-5" />
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex items-center"
                href="/cart"
                data-testid="nav-cart-link"
              >
                <ShoppingCart className="w-5 h-5" />
              </LocalizedClientLink>
            </div>
            {/* Mobile: locale selector + hamburger menu */}
            <div className="md:hidden flex items-center gap-x-3">
              {/* Currency selector on mobile */}
              {regions && <CurrencySelector regions={regions} />}
              {/* Locale selector on mobile */}
              {locales && currentLocale && (
                <LocaleSelector locales={locales} currentLocale={currentLocale} />
              )}
              <button
                className="flex items-center justify-center w-8 h-8"
                aria-label={t('menu')}
                onClick={toggleDrawer}
              >
                <HiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <LeftDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        categories={categories}
      />
    </div>
  )
}

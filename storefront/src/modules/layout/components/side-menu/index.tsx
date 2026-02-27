"use client"

import { Fragment, useState, useRef } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import { useI18n } from "@lib/hooks/use-i18n"
import { ChevronDown } from "@medusajs/icons"
import MegaMenu from "@modules/layout/components/mega-menu"

const TopMenuItems = [
  { key: "store", href: "/store" },
  { key: "account", href: "/account" },
  { key: "cart", href: "/cart" },
]

type TopMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  categories?: HttpTypes.StoreProductCategory[]
}

const TopMenu = ({ regions, locales, currentLocale, categories = [] }: TopMenuProps) => {
  const { t } = useI18n()
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsMegaMenuOpen(true)
  }

  const handleMouseLeave = () => {
    setIsMegaMenuOpen(false)
  }

  return (
    <div className="h-full">
      <nav className="flex items-center justify-between h-full">
        <ul className="flex gap-6 items-center">
          {/* Home with Mega Menu */}
          <li 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="flex items-center gap-1.5 text-base font-medium hover:text-ui-fg-base h-16 transition-colors"
            >
              {t("home")}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {isMegaMenuOpen && categories.length > 0 && (
              <MegaMenu categories={categories} />
            )}
          </li>

          {/* Other menu items */}
          {TopMenuItems.map(({ key, href }) => (
            <li key={key}>
              <LocalizedClientLink
                href={href}
                className="text-base font-medium hover:text-ui-fg-base transition-colors"
              >
                {t(key)}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default TopMenu

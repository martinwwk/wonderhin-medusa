"use client"

import { useState, useRef, useEffect } from "react"
import Globe from "@modules/common/icons/globe"
import ChevronDown from "@modules/common/icons/chevron-down"
import { listLocales, Locale } from "@lib/data/locales"
import { usePathname } from "next/navigation"

interface LocaleSelectorProps {
  locales: Locale[]
  currentLocale: string
}

const LocaleSelector = ({ locales, currentLocale }: LocaleSelectorProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleLocaleChange = (locale: string) => {
    setOpen(false)
    
    // Replace the first segment (current locale) with the new locale
    const segments = pathname.split("/").filter(s => s)
    if (segments.length > 0) {
      segments[0] = locale
    } else {
      segments.unshift(locale)
    }
    
    const newPath = "/" + segments.join("/")
    
    // Navigate to new URL - locale is determined by URL path
    window.location.href = newPath
  }

  const current = locales.find(l => l.code === currentLocale)

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 hover:text-ui-fg-base"
        onClick={() => setOpen((v) => !v)}
        aria-label="Select language"
        type="button"
      >
        <Globe size={20} />
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 border">
          <ul className="py-2">
            {locales.map((locale) => (
              <li key={locale.code}>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${locale.code === currentLocale ? "font-bold" : ""}`}
                  onClick={() => handleLocaleChange(locale.code)}
                >
                  {locale.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default LocaleSelector

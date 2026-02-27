"use client"

import { useEffect, useState } from "react"
import { XMark } from "@medusajs/icons"
import { ChevronDown, ChevronRight } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useClientTranslation } from "@lib/i18n"

const DrawerMenuItems = [
  { key: "home", href: "/" },
  { key: "store", href: "/store" },
  { key: "account", href: "/account" },
  { key: "cart", href: "/cart" },
]

interface LeftDrawerProps {
  isOpen: boolean
  onClose: () => void
  categories?: HttpTypes.StoreProductCategory[]
}

const LeftDrawer = ({ isOpen, onClose, categories = [] }: LeftDrawerProps) => {
  const { t } = useClientTranslation()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const topLevelCategories = categories.filter(cat => !cat.parent_category_id)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] md:hidden"
        onClick={onClose}
        data-testid="drawer-backdrop"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 w-[280px] h-full bg-white shadow-xl z-[70] md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-end p-4 border-b">
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMark className="w-6 h-6" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-1">
              {DrawerMenuItems.map(({ key, href }) => (
                <li key={key}>
                  <LocalizedClientLink
                    href={href}
                    className="flex items-center px-4 py-3 text-base font-normal text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    {t(key)}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>

            {/* Categories Section */}
            {topLevelCategories.length > 0 && (
              <div className="px-4 mt-6 pb-4">
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t("categories")}
                </h3>
                <ul className="space-y-2 mt-2">
                  {topLevelCategories.map((category) => {
                    const hasChildren = category.category_children && category.category_children.length > 0
                    const isExpanded = expandedCategories.has(category.id)
                    
                    return (
                      <li key={category.id}>
                        <div className="flex items-center">
                          {hasChildren ? (
                            <button
                              onClick={() => toggleCategory(category.id)}
                              className="flex items-center flex-1 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-200"
                            >
                              <span className="flex-1 text-left">{category.name}</span>
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          ) : (
                            <LocalizedClientLink
                              href={`/categories/${category.handle}`}
                              className="flex items-center flex-1 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-200"
                              onClick={onClose}
                            >
                              {category.name}
                            </LocalizedClientLink>
                          )}
                        </div>
                        
                        {/* Child categories */}
                        {hasChildren && isExpanded && (
                          <ul className="ml-2 mt-2 space-y-1.5 pl-3 border-l-2 border-gray-100">
                            {category.category_children?.map((child) => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  href={`/categories/${child.handle}`}
                                  className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors hover:text-gray-900"
                                  onClick={onClose}
                                >
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}

export default LeftDrawer
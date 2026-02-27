"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "@medusajs/icons"

type MegaMenuProps = {
  categories: HttpTypes.StoreProductCategory[]
}

const CategoryItem = ({ category }: { category: HttpTypes.StoreProductCategory }) => {
  const hasChildren = category.category_children && category.category_children.length > 0
  const [isHovered, setIsHovered] = useState(false)

  return (
    <li 
      className="relative px-2 py-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LocalizedClientLink
        href={`/categories/${category.handle}`}
        className={`flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-colors ${
          isHovered 
            ? "bg-gray-100 text-black font-medium" 
            : "text-gray-700 hover:bg-gray-50 hover:text-black"
        }`}
      >
        <span>{category.name}</span>
        {hasChildren && (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </LocalizedClientLink>

      {/* Submenu - positioned to the right */}
      {hasChildren && isHovered && (
        <div className="absolute left-full top-0 ml-1.5 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
          <ul className="flex flex-col">
            {category.category_children?.map((child) => (
              <CategoryItem key={child.id} category={child} />
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}

const MegaMenu = ({ categories }: MegaMenuProps) => {
  // Filter to get only top-level categories
  const topLevelCategories = categories.filter(cat => !cat.parent_category_id)

  return (
    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2">
      <ul className="flex flex-col">
        {topLevelCategories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </ul>
    </div>
  )
}

export default MegaMenu

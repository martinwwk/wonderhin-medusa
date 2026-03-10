import { TriangleRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Checkbox, Text, clx } from "@medusajs/ui"
import { useState } from "react"
import { useProductCategories } from "../../../../../hooks/api/categories"

/**
 * Gmail-style category tree with tri-state checkbox support.
 *
 * Features:
 * - Tri-state checkboxes: [] (none), [-] (some), [✓] (all)
 * - Parent checkbox reflects children state (not self)
 * - Bulk toggle: clicking parent toggles all descendants
 * - Expandable tree structure
 *
 * Click Behavior:
 * - [] (unchecked) → click → [✓] (check all children)
 * - [✓] (checked) → click → [] (uncheck all children)
 * - [-] (indeterminate) → click → [] (uncheck all children)
 *
 * @example
 * ```tsx
 * <CategoryCheckboxTree
 *   value={selectedCategoryIds}
 *   onChange={setSelectedCategoryIds}
 * />
 * ```
 */
interface CategoryCheckboxTreeProps {
  value: string[]
  onChange: (value: string[]) => void
}

type CategoryNode = HttpTypes.AdminProductCategory & {
  children?: CategoryNode[]
}

export const CategoryCheckboxTree = ({
  value,
  onChange,
}: CategoryCheckboxTreeProps) => {
  const { product_categories, isPending } = useProductCategories(
    {
      limit: 1000,
      include_descendants_tree: true,
    },
    {
      enabled: true,
    }
  )

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const categoryTree = buildCategoryTree(product_categories || [])

  const handleToggleExpand = (categoryId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  const handleCheck = (categoryId: string) => {
    if (value.includes(categoryId)) {
      onChange(value.filter((id) => id !== categoryId))
    } else {
      onChange([...value, categoryId])
    }
  }

  const handleAddMany = (ids: string[]) => {
    const newValue = new Set(value)
    ids.forEach((id) => newValue.add(id))
    onChange(Array.from(newValue))
  }

  const handleRemoveMany = (ids: string[]) => {
    const idsToRemove = new Set(ids)
    onChange(value.filter((id) => !idsToRemove.has(id)))
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <Text size="small" className="text-ui-fg-muted">
          Loading categories...
        </Text>
      </div>
    )
  }

  return (
    <div className="max-h-[400px] overflow-y-auto rounded-md border p-2">
      {categoryTree.length === 0 ? (
        <Text size="small" className="text-ui-fg-muted p-2">
          No categories found
        </Text>
      ) : (
        <div className="space-y-1">
          {categoryTree.map((category) => (
            <CategoryTreeNode
              key={category.id}
              category={category}
              selectedIds={value}
              expandedNodes={expandedNodes}
              onToggleExpand={handleToggleExpand}
              onCheck={handleCheck}
              onAddMany={handleAddMany}
              onRemoveMany={handleRemoveMany}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CategoryTreeNodeProps {
  category: CategoryNode
  selectedIds: string[]
  expandedNodes: Set<string>
  onToggleExpand: (categoryId: string) => void
  onCheck: (categoryId: string) => void
  onAddMany: (ids: string[]) => void
  onRemoveMany: (ids: string[]) => void
  depth: number
}

const CategoryTreeNode = ({
  category,
  selectedIds,
  expandedNodes,
  onToggleExpand,
  onCheck,
  onAddMany,
  onRemoveMany,
  depth,
}: CategoryTreeNodeProps) => {
  const hasChildren = !!(category.category_children && category.category_children.length > 0)
  const isExpanded = expandedNodes.has(category.id)
  const isSelected = selectedIds.includes(category.id)

  // true = all children selected, false = none, "indeterminate" = some selected
  const checkedState: boolean | "indeterminate" = hasChildren
    ? getCheckedState(category, selectedIds)
    : isSelected

  const handleCheckboxChange = () => {
    if (hasChildren) {
      const allDescendantIds = getAllDescendantIds(category)

      // [] (unchecked) → click → [✓] (check all)
      // [✓] (checked) → click → [] (uncheck all)
      // [-] (indeterminate) → click → [] (uncheck all)
      if (checkedState === false) {
        // Unchecked → check all children -> becomes [✓]
        onAddMany(allDescendantIds)
      } else {
        // Checked or indeterminate → uncheck all children -> becomes []
        onRemoveMany(allDescendantIds)
      }
    } else {
      onCheck(category.id)
    }
  }

  return (
    <div>
      <div
        className={clx(
          "flex items-center gap-x-2 rounded-md px-2 py-1.5 transition-colors",
          "hover:bg-ui-bg-base-hover",
          isSelected && "bg-ui-bg-base-hover"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <button
          type="button"
          onClick={() => hasChildren && onToggleExpand(category.id)}
          className={clx(
            "flex size-5 items-center justify-center rounded transition-colors",
            hasChildren
              ? "text-ui-fg-muted hover:text-ui-fg-base hover:bg-ui-bg-field-hover cursor-pointer"
              : "cursor-default"
          )}
          disabled={!hasChildren}
        >
          {hasChildren && (
            <TriangleRightMini
              className={clx(
                "transition-transform",
                isExpanded && "rotate-90"
              )}
            />
          )}
        </button>

        <Checkbox
          checked={checkedState}
          onCheckedChange={handleCheckboxChange}
          id={`category-${category.id}`}
        />

        <label
          htmlFor={`category-${category.id}`}
          className="flex-1 cursor-pointer text-sm"
        >
          <Text size="small" leading="compact">
            {category.name}
          </Text>
        </label>
      </div>

      {hasChildren && isExpanded && category.category_children && (
        <div className="mt-1">
          {category.category_children.map((child) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              selectedIds={selectedIds}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              onCheck={onCheck}
              onAddMany={onAddMany}
              onRemoveMany={onRemoveMany}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Determines the checkbox state for a category node based on its children.
 *
 * Gmail-style tri-state checkbox logic:
 * - [] = no children selected
 * - [-] = some children selected
 * - [✓] = all children selected
 *
 * IMPORTANT: For parent categories, only checks children (not self).
 * This determines what the checkbox should show based on children's state only.
 *
 * @param category - The category node to check
 * @param selectedIds - Array of selected category IDs
 * @returns true (all children selected), false (none), "indeterminate" (some selected)
 */
const getCheckedState = (
  category: CategoryNode,
  selectedIds: string[]
): boolean | "indeterminate" => {
  const allDescendantIds = getAllDescendantIds(category)

  // No children, use own selected state
  if (allDescendantIds.length === 0) {
    return selectedIds.includes(category.id)
  }

  const selectedCount = allDescendantIds.filter((id) => selectedIds.includes(id)).length

  if (selectedCount === 0) {
    return false
  }
  if (selectedCount === allDescendantIds.length) {
    return true
  }
  return "indeterminate"
}

/**
 * Recursively collects all descendant category IDs.
 * Used for bulk selection/deselection operations.
 *
 * @param category - The category node to get descendants from
 * @returns Array of all descendant category IDs (does not include self)
 */
const getAllDescendantIds = (category: CategoryNode): string[] => {
  const ids: string[] = []

  if (category.category_children) {
    for (const child of category.category_children) {
      ids.push(child.id)
      ids.push(...getAllDescendantIds(child))
    }
  }

  return ids
}

/**
 * Builds a hierarchical tree structure from a flat list of categories.
 * Uses parent_category_id to establish relationships.
 *
 * @param categories - Flat array of categories from API
 * @returns Array of root category nodes with children populated
 */
const buildCategoryTree = (
  categories: HttpTypes.AdminProductCategory[]
): CategoryNode[] => {
  const categoryMap = new Map<string, CategoryNode>()

  categories.forEach((category) => {
    categoryMap.set(category.id, {
      ...category,
      children: category.category_children ? [] : undefined,
    })
  })

  const rootCategories: CategoryNode[] = []

  categories.forEach((category) => {
    const node = categoryMap.get(category.id)
    if (!node) return

    if (category.parent_category_id) {
      const parent = categoryMap.get(category.parent_category_id)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(node)
      } else {
        rootCategories.push(node)
      }
    } else {
      rootCategories.push(node)
    }
  })

  return rootCategories
}

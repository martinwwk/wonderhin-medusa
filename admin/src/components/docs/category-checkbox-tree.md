# CategoryCheckboxTree Component

Gmail-style checkbox tree for category selection with tri-state checkbox support.

## Usage

```tsx
import { CategoryCheckboxTree } from "./common/components/category-checkbox-tree"

<CategoryCheckboxTree
  value={selectedCategoryIds}
  onChange={setSelectedCategoryIds}
/>
```

## Behavior

### Checkbox States

| State | Icon | Meaning |
|-------|------|---------|
| Unchecked | `[]` | No children selected |
| Indeterminate | `[-]` | Some children selected |
| Checked | `[✓]` | All children selected |

### Click Behavior

| Current State | Click Action | Result |
|---------------|--------------|--------|
| `[]` (unchecked) | Click | Check all children → `[✓]` |
| `[✓]` (checked) | Click | Uncheck all children → `[]` |
| `[-]` (indeterminate) | Click | Uncheck all children → `[]` |

### Key Features

1. **Parent checkbox reflects children state** - The parent's checkbox only considers children, not its own ID
2. **Bulk operations** - Clicking a parent toggles all descendants at once
3. **Indeterminate state** - Automatically shows `[-]` when some (but not all) children are selected
4. **Tree expansion** - Click the arrow to expand/collapse children

## Implementation Details

### Helper Functions

- `getCheckedState(category, selectedIds)` - Determines checkbox state based on children
- `getAllDescendantIds(category)` - Recursively gets all descendant IDs
- `buildCategoryTree(categories)` - Converts flat list to tree structure

### Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string[]` | Array of selected category IDs |
| `onChange` | `(value: string[]) => void` | Callback when selection changes |

## Dependencies

- `@medusajs/ui` - Checkbox, Text, clx
- `@medusajs/icons` - TriangleRightMini
- `@medusajs/types` - HttpTypes
- `useProductCategories` hook



import {Checkbox} from "@/components/shared/form/checkbox";
import { usePanel } from "@/hooks/use-panel";
import { colorMap } from "@/data/color-settings";
import {ChevronDown, ChevronUp} from "lucide-react";

export interface CategoryOption {
    id: string
    label: string
    count: number
    subCategories?: CategoryOption[]
}

interface CategoriesFilterProps {
    categories: CategoryOption[]
    selectedCategories: Record<string, boolean>
    expandedCategories?: Record<string, boolean>
    onCategoryChange: (id: string, checked: boolean) => void
    onCategoryExpand?: (id: string) => void
    /** When a parent is toggled, also toggle all its children */
    onParentToggle?: (parentId: string, childIds: string[], checked: boolean) => void
}

/**
 * Determine parent checkbox state based on children selection:
 * - all children selected → checked
 * - some children selected → indeterminate
 * - no children selected → unchecked
 */
function getParentState(
    category: CategoryOption,
    selectedCategories: Record<string, boolean>,
): { checked: boolean; indeterminate: boolean } {
    const subs = category.subCategories;
    if (!subs || subs.length === 0) {
        return { checked: selectedCategories[category.id] || false, indeterminate: false };
    }
    const selectedCount = subs.filter((s) => selectedCategories[s.id]).length;
    if (selectedCount === subs.length) {
        return { checked: true, indeterminate: false };
    }
    if (selectedCount > 0) {
        return { checked: false, indeterminate: true };
    }
    // No children selected → parent is always unchecked
    return { checked: false, indeterminate: false };
}

export function CategoriesFilter({
                                     categories,
                                     selectedCategories,
                                     expandedCategories,
                                     onCategoryChange,
                                     onCategoryExpand,
                                     onParentToggle,
                                 }: CategoriesFilterProps) {
    const { selectedColor } = usePanel();
    return (
        <>
            {categories.map((category) => {
                const hasSubs = category.subCategories && category.subCategories.length > 0;
                const { checked: parentChecked, indeterminate } = getParentState(category, selectedCategories);
                
                return (
                    <div key={category.id} className="space-y-2">
                        <div className="flex items-start justify-center ">
                            <Checkbox
                                id={`category-${category.id}`}
                                checked={parentChecked}
                                indeterminate={indeterminate}
                                onCheckedChange={(checked) => {
                                    if (hasSubs && onParentToggle) {
                                        // Toggle parent + all children
                                        const childIds = category.subCategories!.map((s) => s.id);
                                        onParentToggle(category.id, childIds, checked);
                                    } else {
                                        onCategoryChange(category.id, checked);
                                    }
                                }}
                            />
                            <div className="ps-2.5   flex-1 flex items-center justify-between">
                                <label htmlFor={`category-${category.id}`} className={`text-15px leading-none cursor-pointer group`}>
                                    <span className={`text-slate-900 dark:text-slate-100 ${colorMap[selectedColor].groupHoverLink}`}>{category.label}</span>
                                </label>
                                
                                
                                {onCategoryExpand && hasSubs && (
                                    
                                    <button
                                        onClick={() => onCategoryExpand(category.id)}
                                        className="h-4 w-4 flex items-center justify-center"
                                    >
                                        {expandedCategories && expandedCategories[category.id] ? <ChevronUp/> :
                                            <ChevronDown  />}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {hasSubs && expandedCategories && expandedCategories[category.id] && (
                            <div className="ml-6 my-5 space-y-4">
                                {category.subCategories!.map((subCategory) => (
                                    <div key={subCategory.id} className="flex items-start">
                                        <Checkbox
                                            id={`category-${subCategory.id}`}
                                            checked={selectedCategories[subCategory.id] || false}
                                            onCheckedChange={(checked) => onCategoryChange(subCategory.id, checked)}
                                        />
                                        <label htmlFor={`category-${subCategory.id}`}
                                               className="ps-2.5  text-sm leading-none cursor-pointer group">
                                            <span
                                                className={` ${colorMap[selectedColor].groupHoverLink}`}>{subCategory.label}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    )
}


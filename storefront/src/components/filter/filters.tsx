"use client";

import React, {useCallback} from "react";
import Switch from "@/components/shared/switch";
import {CategoriesFilter} from "@/components/filter/facets/categories-filter";
import {FilterSection} from "@/components/filter/facets/filter-section";
import {ColorsFilter} from "@/components/filter/facets/colors-filter";
import {CategoryOption} from "@/components/filter/facets/categories-filter";

// Sample data for colors and sizes (still static)
import {
    colorsData,
    sizesData
} from "@/components/filter/data";
import {SizesFilter} from "@/components/filter/facets/sizes-filter";
import {PriceRangeFilter} from "@/components/filter/facets/price-range-filter";
import {useFilters} from "@/hooks/use-filter-hooks";

interface FiltersProps {
    categories?: CategoryOption[];
    onCategoryChange?: (selectedCategoryIds: string[]) => void;
    onPriceChange?: (value: [number, number]) => void;
}

/**
 * Collect all selected category IDs from the selection state,
 * considering only sub-category IDs (leaf nodes) for Medusa filtering.
 * If a parent with children is fully selected, include all its children IDs.
 * If a parent without children is selected, include its own ID.
 */
function collectSelectedIds(
    selected: Record<string, boolean>,
    categories: CategoryOption[],
): string[] {
    const ids: string[] = [];
    
    for (const cat of categories) {
        if (cat.subCategories && cat.subCategories.length > 0) {
            // For parents with children: collect selected child IDs
            for (const sub of cat.subCategories) {
                if (selected[sub.id]) {
                    ids.push(sub.id);
                }
            }
        } else {
            // For leaf categories (no children): use parent ID directly
            if (selected[cat.id]) {
                ids.push(cat.id);
            }
        }
    }
    
    return ids;
}

const Filters = ({ categories, onCategoryChange, onPriceChange }: FiltersProps) => {
    const {
        isOnSale,
        setIsOnSale,
        sectionsOpen,
        toggleSection,
        selectedFilters,
        handleFilterChange,
        handleBatchFilterChange,
        priceRange,
        handlePriceRangeChange,
        expandedCategories,
        toggleCategoryExpand,
        MIN_PRICE,
        MAX_PRICE,
    } = useFilters();

    const handlePriceChange = useCallback((value: [number, number]) => {
        handlePriceRangeChange(value);
        onPriceChange?.(value);
    }, [handlePriceRangeChange, onPriceChange]);

    // Notify parent of selected category changes
    const notifyParent = useCallback((newSelected: Record<string, boolean>) => {
        if (onCategoryChange && categories) {
            const ids = collectSelectedIds(newSelected, categories);
            onCategoryChange(ids);
        }
    }, [onCategoryChange, categories]);

    // Single category (child) toggle
    // When unchecking a child, also uncheck its parent if no siblings remain checked.
    const handleCategoryFilterChange = useCallback((id: string, checked: boolean) => {
        if (!checked && categories) {
            // Find the parent that owns this child
            const parent = categories.find((cat) =>
                cat.subCategories?.some((sub) => sub.id === id),
            );
            if (parent && parent.subCategories) {
                const siblingsStillChecked = parent.subCategories.some(
                    (sub) => sub.id !== id && selectedFilters.categories[sub.id],
                );
                if (!siblingsStillChecked) {
                    // Uncheck both child and parent in one batch
                    const updates: Record<string, boolean> = { [id]: false, [parent.id]: false };
                    handleBatchFilterChange("categories", updates);
                    const newSelected = { ...selectedFilters.categories, ...updates };
                    notifyParent(newSelected);
                    return;
                }
            }
        }
        handleFilterChange("categories", id, checked);
        const newSelected = { ...selectedFilters.categories, [id]: checked };
        notifyParent(newSelected);
    }, [handleFilterChange, handleBatchFilterChange, selectedFilters.categories, notifyParent, categories]);

    // Parent toggle: select/deselect all children at once
    const handleParentToggle = useCallback((parentId: string, childIds: string[], checked: boolean) => {
        const updates: Record<string, boolean> = { [parentId]: checked };
        for (const cid of childIds) {
            updates[cid] = checked;
        }
        handleBatchFilterChange("categories", updates);
        
        const newSelected = { ...selectedFilters.categories, ...updates };
        notifyParent(newSelected);
    }, [handleBatchFilterChange, selectedFilters.categories, notifyParent]);


    return (
        <div className=" space-y-6">
            {/* Categories Filter */}
            {categories && categories.length > 0 && (
                <FilterSection title="Categories" isOpen={sectionsOpen.categories}
                               onToggle={() => toggleSection("categories")}>
                    <CategoriesFilter
                        categories={categories}
                        selectedCategories={selectedFilters.categories}
                        expandedCategories={expandedCategories}
                        onCategoryChange={handleCategoryFilterChange}
                        onCategoryExpand={toggleCategoryExpand}
                        onParentToggle={handleParentToggle}
                    />
                </FilterSection>
            )}
            
            {/* Price Range Filter */}
            <FilterSection title="Price range" isOpen={sectionsOpen.price} onToggle={() => toggleSection("price")}>
                <PriceRangeFilter min={MIN_PRICE} max={MAX_PRICE} value={priceRange} onChange={handlePriceChange}/>
            </FilterSection>
            
            {/* Colors Filter */}
            {/* <FilterSection title="Colors" isOpen={sectionsOpen.colors} onToggle={() => toggleSection("colors")}>
                <ColorsFilter
                    colors={colorsData}
                    selectedColors={selectedFilters.colors}
                    onColorChange={(id, checked) => handleFilterChange("colors", id, checked)}
                />
            </FilterSection> */}
            
            {/* Sizes Filter */}
            {/* <FilterSection title="Size" isOpen={sectionsOpen.sizes} onToggle={() => toggleSection("sizes")}>
                <SizesFilter
                    sizes={sizesData}
                    selectedSizes={selectedFilters.sizes}
                    onSizeChange={(id, checked) => handleFilterChange("sizes", id, checked)}
                />
            </FilterSection> */}
            
            {/* <div className="pb-8 pr-2">
                <div className="flex justify-between items-center space-x-2">
                    <div>
                        <label
                            className="text-base font-medium text-neutral-900 dark:text-neutral-200 "
                        >On sale!</label>
                        <p className="text-neutral-500 dark:text-neutral-400  text-sm">
                            Products currently on sale
                        </p>
                    </div>
                    <label className="relative inline-block cursor-pointer switch">
                        <Switch checked={isOnSale} onChange={setIsOnSale} />
                    </label>
                
                </div>
            </div> */}
        </div>
    );
};

export default Filters;

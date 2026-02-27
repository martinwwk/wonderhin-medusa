'use client';

import { useMemo } from 'react';
import { useCategories } from '@/hooks/use-categories';
import { useLocale, useI18n } from '@/lib/hooks/use-i18n';
import { translateCategoryName } from '@/lib/util/translate-category';
import { siteNavigation } from '@/data/navigation-settings';
import { MainMenuType, SubMenuType } from '@/types/template';
import { Category } from '@/types/template';
import { ROUTES } from '@/utils/routes';
import { getProxiedImageUrl } from '@/utils/image-proxy';

/**
 * Transform a Medusa Category into a SubMenuType for the mega menu.
 * Top-level categories get an image and their children as subMenu items.
 */
function categoryToSubMenu(category: Category, locale: string, index: number): SubMenuType {
    const translatedName = translateCategoryName(category.name, locale);
    const imageSrc = category.image?.original
        ? getProxiedImageUrl(category.image.original)
        : undefined;

    return {
        id: index + 1,
        path: `${ROUTES.CATEGORY}/${category.slug}`,
        label: translatedName,
        image: imageSrc
            ? {
                id: category.id?.toString() || String(index),
                thumbnail: imageSrc,
                original: imageSrc,
            }
            : undefined,
        subMenu: category.children && category.children.length > 0
            ? category.children.map((child, childIndex) => ({
                id: childIndex + 1,
                path: `${ROUTES.CATEGORY}/${child.slug}`,
                label: translateCategoryName(child.name, locale),
            }))
            : undefined,
    };
}

/**
 * Build the dynamic "Categories" mega menu item from Medusa categories.
 */
function buildCategoriesMenuItem(categories: Category[], locale: string, t: (key: string) => string): MainMenuType {
    // Find the hardcoded Categories item to preserve its mega menu settings
    const hardcodedCategoriesItem = siteNavigation.menu.find(
        (item) => item.label === 'categories'
    );

    const subMenu = categories.map((cat, index) => categoryToSubMenu(cat, locale, index));

    return {
        id: hardcodedCategoriesItem?.id ?? 2,
        path: '/category',
        label: t('categories'),
        type: 'mega',
        mega_categoryCol: Math.min(subMenu.length, 5),
        mega_bannerMode: (hardcodedCategoriesItem as any)?.mega_bannerMode ?? 'none',
        mega_bannerImg: (hardcodedCategoriesItem as any)?.mega_bannerImg ?? '',
        mega_bannerUrl: (hardcodedCategoriesItem as any)?.mega_bannerUrl ?? '/category',
        mega_contentBottom:
            (hardcodedCategoriesItem as any)?.mega_contentBottom ??
            '<strong>30% Off</strong> the shipping of your first order with the code: <strong>SALE30</strong>',
        subMenu,
    };
}

/**
 * Hook that returns the full site navigation with Categories dynamically
 * populated from the Medusa store. Other menu items remain static.
 *
 * While categories are loading, falls back to the hardcoded navigation.
 */
export function useNavigation() {
    const { data: categories, isLoading } = useCategories();
    const locale = useLocale();
    const { t } = useI18n();

    const menu = useMemo(() => {
        if (!categories || categories.length === 0) {
            // While loading or no categories, translate static menu items
            return siteNavigation.menu.map((item) => ({
                ...item,
                label: t(item.label),
            })) as MainMenuType[];
        }

        // Replace and translate menu items
        return siteNavigation.menu.map((item) => {
            if (item.label === 'categories') {
                return buildCategoriesMenuItem(categories, locale, t);
            }
            return {
                ...item,
                label: t(item.label),
            };
        }) as MainMenuType[];
    }, [categories, locale, t]);

    const topmenu = useMemo(() => {
        return siteNavigation.topmenu.map((item) => ({
            ...item,
            label: t(item.label),
        }));
    }, [t]);

    return {
        menu,
        topmenu,
        isLoading,
    };
}

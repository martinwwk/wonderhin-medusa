"use client"

import React, {useMemo} from "react"
import ActiveLink from "@/components/shared/active-link"
import useBreadcrumb, {formarBreadcrumbTitle} from "@/utils/use-breadcrumb"

import {ROUTES} from "@/utils/routes"
import {Dot} from "lucide-react";
import { useI18n, useLocale } from "@lib/hooks/use-i18n";
import { useCategoryMap } from "@/hooks/use-category-map";

interface BreadcrumbItemProps {
    children: React.ReactNode
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({children, ...props}) => {
    return (
        <li
            className="h-full text-sm"
            {...props}
        >
            {children}
        </li>
    )
}

interface BreadcrumbSeparatorProps {
    children: React.ReactNode
}

const BreadcrumbSeparator: React.FC<BreadcrumbSeparatorProps> = ({children, ...props}) => {
    return (
        <li className="text-base text-brand-dark" {...props}>
            {children}
        </li>
    )
}

interface BreadcrumbItemsProps {
    children: React.ReactNode
    separator: React.ReactNode
}

export const BreadcrumbItems: React.FC<BreadcrumbItemsProps> = ({children, separator}) => {
    const childrenArray = React.Children.toArray(children)
    
    const items = childrenArray.map((child, index) => (
        <BreadcrumbItem key={`breadcrumb_item${index}`}>{child}</BreadcrumbItem>
    ))
    
    const lastIndex = items.length - 1
    
    const itemsWithSeparators = items.reduce((acc: React.ReactNode[], child, index) => {
        const notLast = index < lastIndex
        if (notLast) {
            acc.push(child, <BreadcrumbSeparator key={`breadcrumb_sep${index}`}>{separator}</BreadcrumbSeparator>)
        } else {
            acc.push(child)
        }
        return acc
    }, [])
    
    return (
        <div className="min-h-[30px]">
            <ol className="flex items-center flex-wrap w-full overflow-hidden">{itemsWithSeparators}</ol>
        </div>
    )
}

interface BreadcrumbProps {
    separator?: React.ReactNode
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
                                                   separator = <Dot className=" opacity-20 "/>,
                                               }) => {
    const breadcrumbs = useBreadcrumb();
    const { t } = useI18n();
    const locale = useLocale();
    const { resolveSlug, slugToName } = useCategoryMap(locale);
    
    // Translation map for common breadcrumb paths
    const breadcrumbTranslations: Record<string, string> = {
        'compare': t('compare'),
        'cart': t('cart'),
        'checkout': t('checkout'),
        'account': t('account'),
        'orders': t('orders'),
        'account-savelists': t('accountSavelists'),
        'category': t('category'),
    };
    
    const memoizedBreadcrumbs = useMemo(() => {
        return breadcrumbs?.map((breadcrumb) => {
            const segment = breadcrumb.breadcrumb;
            // 1. Static route translations (compare, cart, category, etc.)
            const staticLabel = breadcrumbTranslations[segment];
            // 2. Category slug lookup from Medusa data
            const categoryLabel = !staticLabel ? resolveSlug(segment) : undefined;
            // 3. Fall back to slug-formatted title
            const fallbackLabel = formarBreadcrumbTitle(segment);
            
            const label = staticLabel || categoryLabel || fallbackLabel;
            
            return (
                <ActiveLink href={breadcrumb.href} activeClassName="text-heading" key={breadcrumb.href}>
                    <span className="capitalize">{label}</span>
                </ActiveLink>
            );
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[breadcrumbs, t, slugToName]);
    return (
        <BreadcrumbItems separator={separator}>
            <ActiveLink href={ROUTES.HOME} activeClassName="">
              <span className="flex items-center h-full">
                {t('home')}
              </span>
            </ActiveLink>
            
            {memoizedBreadcrumbs}
        </BreadcrumbItems>
    )
}

export default Breadcrumb


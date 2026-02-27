'use client';
import React, { useMemo } from "react";
import cn from "classnames";
import {footerSettings} from '@/data/footer-settings';
import Widgets from "@/layouts/footer/widget";
import Copyright from "@/layouts/footer/copyright";
import { useCategories } from '@/hooks/use-categories';
import { useLocale } from '@/lib/hooks/use-i18n';
import { translateCategoryName } from '@/lib/util/translate-category';
import { ROUTES } from '@/utils/routes';

const {widgets: staticWidgets, payment} = footerSettings;

interface FooterProps {
    variant?: "default" | "dark";
    className?: string;
    container?: string;
    showWidgetSubscription?: boolean;
}

const Footer: React.FC<FooterProps> = ({
                                           variant = 'default',
                                           className,
                                            container,
                                           showWidgetSubscription = true}) => {
    const { data: categories } = useCategories();
    const locale = useLocale();

    // Build dynamic widgets with categories from Medusa
    const widgets = useMemo(() => {
        if (!categories || categories.length === 0) {
            return staticWidgets;
        }

        // Replace the "shopCategories" widget with dynamic category data
        return staticWidgets.map((widget) => {
            if (widget.widgetTitle === 'shopCategories') {
                return {
                    ...widget,
                    lists: categories.slice(0, 6).map((cat, index) => ({
                        id: index + 1,
                        title: cat.name, // Will be translated by widget-link component
                        path: `${ROUTES.CATEGORY}/${cat.slug}`,
                    })),
                };
            }
            return widget;
        });
    }, [categories]);

    return (
        <footer className={cn(
            {
                'mt-7.5 md:mt-18 border-t border-black/10': variant === 'default',
                'mt-7.5 md:mt-18 bg-brand-dark text-white/55': variant === 'dark',
            },
            className
        )}
        >
            <Widgets widgets={widgets} variant={variant} container={container}
                     showWidgetSubscription={showWidgetSubscription}/>
            <Copyright payment={payment} variant={variant} container={container}/>
        </footer>
    );
};

export default Footer;

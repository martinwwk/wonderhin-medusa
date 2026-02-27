'use client';
import {BsChevronDown} from 'react-icons/bs';
import cn from 'classnames';
import {MainMenuType, SubMenuType} from "@/types/template";
import React, { useMemo, useRef, useCallback, useEffect } from "react";
import {usePanel} from "@/hooks/use-panel";
import {colorMap} from "@/data/color-settings";
import SubDemo from "@/components/shared/mega/sub-demo";
import ListMenu from '@/components/shared/mega/list-menu';
import SubMega from '@/components/shared/mega/sub-mega';
import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import {motion} from 'motion/react';
import {usePathname} from 'next/navigation';

interface MenuProps {
    navigations: MainMenuType[];
    className?: string;
    classLink?: string;
}

// eslint-disable-next-line react/display-name
const MainMenu: React.FC<MenuProps> = React.memo(({ navigations, className, classLink }) => {
    const { selectedColor } = usePanel();
    const [activeMenuId, setActiveMenuId] = React.useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    // Close mega menu on route change
    useEffect(() => {
        setActiveMenuId(null);
    }, [pathname]);

    const closeMenu = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveMenuId(null);
    }, []);

    const showSubMenu = useCallback((id: number) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveMenuId(id);
    }, []);

    const hideSubMenu = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setActiveMenuId(null);
        }, 300);
    }, []);

    const animationVariants = useMemo(
        () => ({
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
        }),
        []
    );

    const menuItems = useMemo(() => {
        return navigations?.map((item: MainMenuType) => {
            const showSubContent = item?.subMenu && activeMenuId === item.id;

            let submenuComponent = null;

            if (showSubContent) {
                switch (item?.type) {
                    case 'mega':
                        submenuComponent = <SubMega item={item} onLinkClick={closeMenu} />;
                        break;
                    case 'demo':
                        submenuComponent = <SubDemo item={item} />;
                        break;
                    default:
                        submenuComponent = (
                            <ul className="py-3 text-sm">
                                {item.subMenu.map((menu: SubMenuType, index: number) => {
                                    const dept: number = 1;
                                    const menuName: string = `sidebar-menu-${dept}-${index}`;
                                    return (
                                        <ListMenu
                                            dept={dept}
                                            data={menu}
                                            hasSubMenu={!!(menu.subMenu && menu.subMenu.length > 0)}
                                            menuName={menuName}
                                            key={menuName}
                                            menuIndex={index}
                                        />
                                    );
                                })}
                            </ul>
                        );
                }
            }

            return (
                <div
                    className={`menuItem group py-3.5 mx-2 xl:mx-4 ${item.type === 'mega' || item.type === 'demo' ? '' : 'relative'}`}
                    key={item.id}
                    onMouseEnter={() => showSubMenu(item.id)}
                    onMouseLeave={hideSubMenu}
                >
                    <LocalizedClientLink
                        href={item.path}
                        className={cn(
                            'text-brand-dark inline-flex items-center text-15px py-1 font-semibold relative reversed-links',
                            colorMap[selectedColor].hoverLink,
                            classLink
                        )}
                   
                    >
                        {item.label}
                        {item?.subMenu && item.subMenu.length > 0 && (
                            <span className="text-xs w-4 flex justify-end opacity-80">
                                <BsChevronDown className="transition duration-300 ease-in-out transform"/>
                            </span>
                        )}
                    </LocalizedClientLink>

                    {showSubContent && (
                        <motion.div
                            className={cn(
                                "drop-shadow-dropDown bg-white z-30 absolute start-0 top-full",
                                !item?.type ? 'subMenu w-[250px] rounded-b-xl' : 'subMega w-full border-t border-border-two'
                            )}
                            variants={animationVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {submenuComponent}
                        </motion.div>
                    )}
                </div>
            );
        });
    }, [navigations, activeMenuId, hideSubMenu, closeMenu, selectedColor, classLink, animationVariants, showSubMenu]);

    return (
        <nav className={cn('headerMenu hidden lg:flex', className)}>
            {menuItems}
        </nav>
    );
});

export default MainMenu;

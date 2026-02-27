'use client';
import Link from '@/components/shared/link';
import cn from 'classnames';

import { MenutopType } from "@/types/template";
import { useIsMounted } from "@/utils/use-is-mounted";
// import Direction from '@/layouts/header/action/direction';
// import SwitchDark from '@/layouts/header/action/switch-dark';
import LanguageSwitcher from '@/layouts/header/action/language-switcher';
import React from "react";
import { useCompare } from "@/hooks/use-compare";


interface MenuProps {
    data?: MenutopType[];
    className?: string;
    classNameLink?: string;
    variant?: string;
}

const HeaderMenutop: React.FC<MenuProps> = ({ data, className, classNameLink }) => {
    const { compareList } = useCompare(); // this is just the array of products
    const mounted = useIsMounted();
    const totalCompare = mounted ? compareList.length : 0;
    return (
        <nav
            className={cn(
                ' flex relative ',
                className
            )}
        >
            {data?.map((item: MenutopType) => (
                <div
                    className={`menuItem group cursor-pointer mx-2 md:mx-3`}
                    key={item.id}
                >
                    <Link
                        href={item.path}
                        className={`${classNameLink ? classNameLink : 'text-brand-muted'} inline-flex items-center py-2 font-normal relative `}
                    >
                        {item.label}
                        <span className={"ms-1"}>{item.path === '/compare' && `(${totalCompare})`}</span>

                    </Link>

                </div>
            ))}
            <LanguageSwitcher />
            {/* <Direction/> */}
            {/* <SwitchDark/> */}
        </nav>
    );
};

export default HeaderMenutop;

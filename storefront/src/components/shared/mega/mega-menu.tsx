import Link from '@/components/shared/link';
import Image from '@/components/shared/image';
import {SubMenuType} from "@/types/template";
import React from "react";
import cn from "classnames";

interface ListMenuProps {
    dept: number;
    data: SubMenuType;
    hasSubMenu: boolean;
    menuIndex: number;
    menuName?: string;
    onLinkClick?: () => void;
}

const ListMenu: React.FC<ListMenuProps> = ({dept, data, hasSubMenu, menuIndex, onLinkClick}) => {
    return (
        <li className="relative">
            {data?.image && (
                <Link href={data.path} className={`block pb-2`} onClick={onLinkClick}>
                    <Image
                        src={data?.image?.thumbnail ?? '/assets/placeholder/collection.svg'}
                        alt={data.label || ('text-category-thumbnail')}
                        width={255}
                        height={160}
                        rootClassName={"flex items-center justify-center overflow-hidden rounded-md"}
                        className=" duration-500 ease-out hover:scale-110 "
                    />
                </Link>
            )}

            <Link
                href={data.path}
                className={`flex items-center gap-2 py-1 ${dept === 1 ? 'font-semibold text-brand-dark' : ''}`}
                onClick={onLinkClick}
            >
                <span className={"reversed-links py-1"}>
                     {data.label}
                </span>
                {data.badge && (
                    <span className={cn("text-[9px] font-semibold uppercase leading-5 px-2 text-brand-light rounded-full inline-block",{
                         "bg-red-600": data.badge =='hot',
                        "bg-blue-600": data.badge =='new',
                        }

                    )}
                    > {data.badge}</span>
                )}
            </Link>
            {hasSubMenu && data.subMenu && (
                <SubMenu
                    dept={dept}
                    data={data.subMenu}
                    menuIndex={menuIndex}
                    onLinkClick={onLinkClick}
                />
            )}
        </li>
    );
};

interface SubMenuProps {
    dept: number;
    data: SubMenuType[];
    menuIndex: number;
    onLinkClick?: () => void;
}

const SubMenu: React.FC<SubMenuProps> = ({dept, data, menuIndex, onLinkClick}) => {
    dept = dept + 1;
    return (
        <ul className="subMenuChild  w-full">
            {data?.map((menu: SubMenuType, index: number) => {
                const menuName: string = `sidebar-submenu-${dept}-${menuIndex}-${index}`;
                return (
                    <ListMenu
                        dept={dept}
                        data={menu}
                        hasSubMenu={!!(menu.subMenu && menu.subMenu.length > 0)}
                        menuName={menuName}
                        key={menuName}
                        menuIndex={index}
                        onLinkClick={onLinkClick}
                    />
                );
            })}
        </ul>
    );
};

export default ListMenu;

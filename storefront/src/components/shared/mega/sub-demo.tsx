import Container from '@/components/shared/container';
import Image from '@/components/shared/image';
import Link from '@/components/shared/link';
import {MainMenuType, SubMenuType} from "@/types/template";
import {usePanel} from "@/hooks/use-panel";
import {colorMap} from "@/data/color-settings";
import cn from "classnames";
import React from "react";

interface MenuProps {
    item: MainMenuType;

}

const SubDemo: React.FC<MenuProps> = ({item}) => {

    return (
        <>
            <Container>
                <div className={` pt-8 py-10 max-w-5xl m-auto`}>
                    <ul
                        className={`text-body text-sm grid gap-10  justify-center  grid-cols-4 grid-flow-row auto-rows-max`}
                    >
                        {item.subMenu.map((menu: SubMenuType, index: number) => {
                            const dept: number = 1;
                            const menuName: string = `sidebar-menu-${dept}-${index}`;
                            return (
                                <ListMenu
                                    dept={dept}
                                    data={menu}
                                    hasSubMenu={!!menu.subMenu}
                                    menuName={menuName}
                                    key={menuName}
                                    menuIndex={index}
                                />
                            );
                        })}
                    </ul>

                </div>
            </Container>
        </>
    );
};

interface ListMenuProps {
    dept: number;
    data: SubMenuType;
    hasSubMenu: boolean;
    menuIndex: number;
    menuName?: string;
}
const ListMenu: React.FC<ListMenuProps> = ({ data}) => {
    const {selectedColor} = usePanel();
    return (
        <li className="p-3 bg-white rounded-md overflow-hidden text-center drop-shadow-thumb border border-transparent hover:border-brand-dark transition-all duration-300 ">
            {data?.image && (
                <Link href={data.path} className={`group `}>
                    <Image
                        src={data?.image?.thumbnail ?? '/assets/placeholder/collection.svg'}
                        alt={data.label || ('text-category-thumbnail')}
                        width={200}
                        height={230}
                        className="bg-sink-thumbnail object-cover transition duration-200 ease-in-out transform "
                    />
                    <span className={cn("text-sm block font-medium text-brand-dark py-3 ",colorMap[selectedColor].hoverLink)}>{data.label}</span>
                </Link>
            )}


        </li>
    );
};

export default SubDemo;

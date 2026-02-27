import {JSX, useCallback, useEffect, useState} from 'react';
import Link from '@/components/shared/link';
import { useNavigation } from '@/hooks/use-navigation';
import Scrollbar from '@/components/shared/scrollbar';
import { IoIosArrowDown } from 'react-icons/io';
import Logo from '@/components/shared/logo';
import { useUI } from '@/hooks/use-UI';
import cn from 'classnames';
import { usePathname } from 'next/navigation';

import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoYoutube,
  IoClose,
} from 'react-icons/io5';
import {SubMenuType} from "@/types/template";
import {ListMenuProps, SubMenuProps} from "@/components/shared/mega/list-menu";
// Interface for social media links
interface SocialItem {
  id: number;
  link: string;
  icon: JSX.Element;
  className: string;
  title: string;
}


const social: SocialItem[] = [
  {
    id: 0,
    link: 'https://www.facebook.com/',
    icon: <IoLogoFacebook className={"w-6 h-6"} />,
    className: 'facebook',
    title: 'text-facebook',
  },
  {
    id: 1,
    link: 'https://twitter.com/',
    icon: <IoLogoTwitter className={"w-6 h-6"}/>,
    className: 'twitter',
    title: 'text-twitter',
  },
  {
    id: 2,
    link: 'https://www.youtube.com/',
    icon: <IoLogoYoutube className={"w-6 h-6"} />,
    className: 'youtube',
    title: 'text-youtube',
  },
  {
    id: 3,
    link: 'https://www.instagram.com/',
    icon: <IoLogoInstagram className={"w-6 h-6"} />,
    className: 'instagram',
    title: 'text-instagram',
  },
];

export default function MobileMenu() {
  const [activeMenus, setActiveMenus] = useState<string[]>([]);
  const { closeSidebar } = useUI();
  const { menu } = useNavigation();
  const pathname = usePathname();

  // Auto-close the mobile drawer when the route changes
  useEffect(() => {
    closeSidebar();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleArrowClick = useCallback((menuName: string) => {
    const newActiveMenus = [...activeMenus];
    if (newActiveMenus.includes(menuName)) {
      const index = newActiveMenus.indexOf(menuName);
      if (index > -1) {
        newActiveMenus.splice(index, 1);
      }
    } else {
      newActiveMenus.push(menuName);
    }
    setActiveMenus(newActiveMenus);
  },[activeMenus]);
  

  const ListMenu: React.FC<ListMenuProps> = ({
    dept,
    data,
    hasSubMenu,
    menuName,
    menuIndex,
    className
  }) =>
    data.label && (
      <li className={`transition-colors duration-200 ${className}`}>
        <div className="flex items-center justify-between">
          <Link
            href={data.path}
            className="flex-1 py-3 transition duration-300 ease-in-out menu-item ltr:pl-5 rtl:pr-5 md:ltr:pl-7 md:rtl:pr-7 ltr:pr-4 rtl:pl-4 text-brand-dark"
            onClick={closeSidebar}
          >
            {data.label}
          </Link>
          {hasSubMenu && (
            <button
              className="cursor-pointer h-10 w-12 shrink-0 flex items-center justify-center text-[17px] text-brand-dark text-opacity-80"
              onClick={() => handleArrowClick(menuName)}
            >
              <IoIosArrowDown
                className={`transition duration-200 ease-in-out transform ${
                  activeMenus.includes(menuName) ? '-rotate-180' : 'rotate-0'
                }`}
              />
            </button>
          )}
        </div>
        {hasSubMenu && (
          <SubMenu
            dept={dept}
            data={data.subMenu || []}
            toggle={activeMenus.includes(menuName)}
            menuIndex={menuIndex}
          />
        )}
      </li>
    );

  const SubMenu: React.FC<SubMenuProps> = ({ dept, data, toggle, menuIndex }) => {
    if (!toggle) {
      return null;
    }

    dept = dept + 1;


    return (
      <ul className={cn('mobile-sub-menu', dept > 2 && '-ms-4')}>
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
              className={cn(
                dept > 1 && 'ps-4',
                dept > 2 && 'ps-8'
              )}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <div className="flex flex-col  w-full h-full">
        <div className="bg-gray-100 w-full border-b border-border-base flex justify-between items-center relative ltr:pl-5 rtl:pr-5 md:ltr:pl-7 md:rtl:pr-7 shrink-0 py-0.5">
          <div role="button" onClick={closeSidebar} className="inline-flex">
            <Logo />
          </div>

          <button
            className="flex items-center justify-center px-4 py-5 text-2xl transition-opacity md:px-5 lg:py-8 focus:outline-none hover:opacity-60"
            onClick={closeSidebar}
            aria-label="close"
          >
            <IoClose  />
          </button>
        </div>

        <Scrollbar className="flex-grow mb-auto menu-scrollbar">
          <div className="flex flex-col px-0  text-brand-dark h-[calc(100vh_-_150px)]">
            <ul className="mobile-menu">
              {menu.map((menuItem: SubMenuType, index:number) => {
                const dept: number = 1;
                const menuName: string = `sidebar-menu-${dept}-${index}`;

                return (
                  <ListMenu
                    dept={dept}
                    data={menuItem}
                    hasSubMenu={!!(menuItem.subMenu && menuItem.subMenu.length > 0)}
                    menuName={menuName}
                    key={menuName}
                    menuIndex={index}
                  />
                );
              })}
            </ul>
          </div>
        </Scrollbar>

        <div className="flex items-center justify-center py-3 -mx-3 border-t text-brand-light border-border-base px-7 shrink-0">
          {social?.map((item, index) => (
            <Link
              href={item.link}
              className={`text-heading mx-3 transition duration-300 ease-in text-brand-dark text-opacity-60 hover:text-brand ${item.className}`}
              key={index}
            >
              <span className="sr-only">{(`${item.title}`)}</span>
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}


import Link from '@/components/shared/link';
import cn from 'classnames';
import { ROUTES } from '@/utils/routes';
import { usePanel } from "@/hooks/use-panel";
import { colorMap } from "@/data/color-settings";
import {Category, SidebarMenuItemProps} from "@/components/shared/category-menu";

export interface SubMegaVerticalProps {
    items: Category[];
    className?: string;
}

function SidebarMenuItem({ className, item, depth = 0 }: SidebarMenuItemProps) {
  const { name, children: items } = item;
    const { selectedColor } = usePanel();
  return (
    <>
      <li
        className={`relative transition  ${className ? className : 'text-sm '}`}
      >
        <Link
          href={ROUTES.CATEGORIES}
          className={`flex items-center w-full  ${
            items ? 'font-semibold' : ' '
          }`}
        >
          <span className="capitalize reversed-links py-1">{name}</span>
        </Link>
        {Array.isArray(items) && (
          <div
            className={`subMenuChild w-full py-1 subMega--level${depth} ${
              depth > 1 && ' hidden '
            }`}
          >
            <ul key="content" className="text-sm">
              {items?.map((currentItem) => {
                const childDepth = depth + 1;
                return (
                  <SidebarMenuItem
                    key={`${currentItem.name}${currentItem.slug}`}
                    item={currentItem}
                    depth={childDepth}
                    className={cn(
                      'text-sm text-brand-dark ', colorMap[selectedColor].hoverLink
                    )}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </li>
    </>
  );
}

const SubMegaVertical = ({ items }: SubMegaVerticalProps) => {
  const depth = 0;
  return (
    <div className="dropdownMenu hidden md:block absolute z-10 left-full top-0 w-[800px] bg-white opacity-0 invisible drop-shadow-dropDown">
      <ul
        key="content"
        className="text-xs ps-7 px-5 py-4 grid grid-cols-3 gap-4"
      >
          {items?.map((currentItem) => {
          const childDepth = depth + 1;
          return (
            <SidebarMenuItem
              key={`${currentItem.name}${currentItem.slug}`}
              item={currentItem}
              depth={childDepth}
              className={cn('text-sm  text-brand-dark ')}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default SubMegaVertical;

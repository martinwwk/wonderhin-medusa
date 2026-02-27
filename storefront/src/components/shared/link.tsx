'use client';
import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import { LinkProps as NextLinkProps } from 'next/link';
import { usePanel } from "@/hooks/use-panel";
import { colorMap } from "@/data/color-settings";
import cn from "classnames";
import React from "react";

const Link: React.FC<
  NextLinkProps & {
    className?: string;
    children?: React.ReactNode;
    variant?: 'base' | 'line' | 'reversed'|'reversed-ani'| 'button-border' | 'button-primary'| 'button-black'| 'button-white'| 'button-detail'| 'button-mercury' | 'btnFurni-detail';
    title?: string;
  }
> = ({ children, className, title,variant = 'line', ...props }) => {
    const { selectedColor } = usePanel();
    const btnClassName = "rounded-full    font-semibold text-[15px] px-3 lg:px-12  py-3  leading-6  break-all cursor-pointer  text-center transition-all ease-in-out duration-300";
    const rootClassName = cn(
        'group ',
        {
            [colorMap?.[selectedColor]?.text as string ] : variant === 'base',
            [` ${colorMap?.[selectedColor]?.hoverLink} transition-all ease-in-out duration-300` ]: variant === 'line',
            [`reversed-links sm:inline-block ${colorMap?.[selectedColor]?.hoverLink}` ]: variant === 'reversed',
            [`reversed-animation sm:inline-block ${colorMap?.[selectedColor]?.hoverLink}` ]: variant === 'reversed-ani',
            [`text-black font-medium border border-gray-400 ${btnClassName} hover:border-brand-dark hover:bg-brand-dark hover:text-white `] : variant === 'button-border',
            [`bg-brand-dark dark:bg-brand-light  text-white ${btnClassName} ${colorMap[selectedColor].hoverBg}`] : variant === 'button-black',
            [`${btnClassName} bg-white  text-brand-dark hover:bg-brand-dark hover:text-white`] : variant === 'button-white',
            [`text-brand-light ${btnClassName} ${colorMap[selectedColor].bg} ${colorMap[selectedColor].hoverBg}`] : variant === 'button-primary',
            [`inline-block text-center min-w-[150px] flex px-4 py-2  relative leading-6 text-brand-light font-medium rounded-full  text-[15px] ${colorMap[selectedColor].bg} ${colorMap[selectedColor].hoverBg}`] : variant === 'button-detail',
            [`${btnClassName} w-full text-brand-dark  bg-white/90 hover:bg-brand-dark hover:text-white  backdrop-blur`] : variant === 'button-mercury',
            [`w-full xs:rounded-none text-center min-w-[150px] flex px-4 py-2  relative leading-6 text-brand-light font-medium rounded text-[13px] items-center justify-center ${colorMap[selectedColor].bg} ${colorMap[selectedColor].hoverBg}`] : variant === 'btnFurni-detail',
        },
        className
    );
  return (
    <LocalizedClientLink {...props} title={title} className={rootClassName} >
      {children}
    </LocalizedClientLink>
  );
};

export default Link;


import { BsX } from 'react-icons/bs';
import cn from 'classnames';
import Container from "@/components/shared/container";
import React from "react";

type HighlightedBarProps = {
  onClose?: (e: React.SyntheticEvent) => void;
    variant?: 'dark' | 'primary' | 'purple' ;
  className?: string;
};

const basedClasses = {
  dark: ' bg-black dark:bg-gray-200',
  purple: ' bg-linear-65 from-purple-500 to-pink-500',
  primary: 'bg-linear-to-r from-red-700 to-red-600',
};

export default function HighlightedBar({
  onClose,
  children,
  className='bg-black dark:bg-gray-200',
}: React.PropsWithChildren<HighlightedBarProps>) {
  return (
    <div
      className={cn(
        ' w-full',
        className
      )}
    >
      <Container variant={"fluid"}>
          <div className={"z-50 py-2.5 px-4 md:px-6 lg:px-36 leading-5.5  items-center justify-center relative"}>
              {children}
              <button
                  onClick={onClose}
                  aria-label="Close Button"
                  className="absolute text-white top-1.5 flex items-center justify-center transition-colors duration-200 rounded-full outline-none w-7 md:w-8 h-7 md:h-8 end-0    hover:bg-brand-light/10 "
              >
                  <BsX className="w-6 h-6" />
              </button>
          </div>
      </Container>
    </div>
  );
}

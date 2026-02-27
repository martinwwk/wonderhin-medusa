'use client';

import cn from 'classnames';
import {forwardRef, ButtonHTMLAttributes} from 'react';
import {ImSpinner2} from 'react-icons/im';
import {usePanel} from "@/hooks/use-panel";
import {colorMap} from "@/data/color-settings";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    variant?: 'primary' | 'border' | 'formButton' | 'dark' | 'white' | 'paypal' | 'white-w45' | 'compare-pdp' | 'link';
    active?: boolean;
    type?: 'submit' | 'reset' | 'button';
    loading?: boolean;
    disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        className,
        variant = 'primary',
        children,
        active,
        loading = false,
        disabled = false,
        ...rest
    } = props;
    const {selectedColor} = usePanel();

    const rootClassName = cn(
        'rounded-full font-semibold text-15px leading-5 inline-flex items-center cursor-pointer transition-all ease-in-out duration-300  text-center justify-center  placeholder-white focus-visible:outline-none focus:outline-none',
        {
            [`text-brand-dark  ${colorMap[selectedColor].hoverLink}`]: variant === 'link',
            [`h-12   text-brand-light px-5 md:px-6 lg:px-8 py-3 md:py-3.5  ${colorMap[selectedColor].bg} ${colorMap[selectedColor].hoverBg}`]: variant === 'primary',
            ['bg-brand-dark dark:bg-brand-light hover:bg-brand-dark/90 text-white px-7 py-3 md:py-3.5 ']: variant === 'dark',
            ['bg-white text-brand-dark hover:bg-brand-dark hover:text-white px-5 md:px-6 lg:px-7 py-3 md:py-3.5 ']: variant === 'white',
            ['h-11 w-11  bg-white/90 text-brand-dark hover:bg-brand-dark  hover:text-white ']: variant === 'white-w45',
            ['h-12 w-full bg-[#ffc439] hover:bg-[#f0b82d] text-black dark:text-white sm:font-normal px-5 md:px-6 lg:px-8 py-3 md:py-3.5 ']: variant === 'paypal',
            [`text-base border border-gray-400  px-5  py-3.5   ${colorMap[selectedColor].hoverBorder} ${colorMap?.[selectedColor]?.hoverLink}`]: variant === 'border',
            [`h-11 md:h-[50px] min-w-[160px]  text-white  px-7 py-3 md:py-3.5   focus:bg-opacity-70 bg-brand-dark ${colorMap[selectedColor].hoverBg}`]: variant === 'formButton',
            [`h-12 w-full md:w-12  border border-brand-dark/15  hover:bg-brand-dark hover:text-white`]: variant === 'compare-pdp',
            'cursor-not-allowed hover:cursor-not-allowed bg-opacity-50 ': disabled,
        },
        className
    );

    return (
        <button
            aria-pressed={active}
            data-variant={variant}
            ref={ref}
            className={rootClassName}
            disabled={disabled}
            {...rest}
        >
            {children}
            {loading && (
                <ImSpinner2 className="w-5 h-5 animate-spin ltr:-mr-1 rtl:-ml-1 ltr:ml-3 rtl:mr-3 "/>
            )}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;

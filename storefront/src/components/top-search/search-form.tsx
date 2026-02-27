import React from 'react';
import cn from 'classnames';
import SearchIcon from '@/components/icons/search-icon';
import CloseIcon from '@/components/icons/close-icon';
import { useUI } from '@/hooks/use-UI';
import { useI18n } from "@lib/hooks/use-i18n";

type SearchBoxProps = {
    className?: string;
    searchId?: string;
    onSubmit: (e: React.SyntheticEvent) => void;
    onClear: (e: React.SyntheticEvent) => void;
    onFocus: (e: React.SyntheticEvent) => void;
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    name?: string;
    value: string;
    useBtnSeach?: boolean;
    variant?: 'border' | 'dark' | 'fill';
};

// eslint-disable-next-line react/display-name
const SearchForm = React.forwardRef<HTMLInputElement, SearchBoxProps>(
    (
        {
            className,
            searchId = 'search',
            variant = 'border',
            value,
            onSubmit,
            onClear,
            onFocus,
            useBtnSeach = false,
            ...rest
        },
        ref,
    ) => {
        
        const {displayMobileSearch,toggleSearch} = useUI();
        const { t } = useI18n();
        
        return (
            <>
                {useBtnSeach ? (
                    // The Button Search
                    <button
                        className={cn("relative cursor-pointer hidden lg:block")}
                        onClick={toggleSearch}
                        aria-label="Search Button"
                    >
                        <span className="sr-only">Search</span>
                        <SearchIcon/>
                    </button>
                ) : (
                    // The Form Search
                    <div className={cn( className,
                        [displayMobileSearch ? 'lg:min-w-[800px] block lg:m-auto' : 'hidden lg:block lg:max-w-[200px] lg:min-w-48']
                    )}>
                        <form
                            className="flex w-full relative "
                            noValidate
                            role="search"
                            onSubmit={onSubmit}
                        >
                            {value ? (
                                <button
                                    type="button"
                                    onClick={onClear}
                                    title="Clear search"
                                    className="absolute top-0 flex items-center justify-center h-full transition duration-200 ease-in-out outline-none start-0  w-14 md:w-16 hover:text-heading focus:outline-none dark:text-white"
                                >
                                    <CloseIcon className="w-[15px] h-[15px]  opacity-50"/>
                                </button>
                            ) : (
                                <span
                                    className="absolute top-0 flex items-center justify-center h-full w-14 md:w-16 start-0 shrink-0 focus:outline-none ">
                                    <SearchIcon className="w-5 h-5  opacity-80"/>
                                </span>
                            )}
                            <label htmlFor={searchId} className="flex flex-1 items-center py-0.5">
                                <input
                                    id={searchId}
                                    className={cn(
                                        'text-heading outline-none w-full h-[40px] pe-5 md:pe-6  ps-14    text-brand-dark dark:text-white text-sm rounded-full transition-all duration-200  focus:ring-0 placeholder:text-brand-dark/50 dark:placeholder:text-white/50',
                                        {
                                            'border-1 leading-6  bg-white dark:bg-gray-400 border-black/10 dark:border-white/10  focus:border-black/50 focus:ring-0 ': variant === 'border',
                                            'bg-brand-light border-2 border-black/10  dark:border-white/15 focus:border-black/50 ': variant === 'dark',
                                            'bg-gray-100 border-0 focus:border-black/50 lg:h-[44px]': variant === 'fill',
                                            
                                        }
                                    )}
                                    placeholder={t('searchPlaceholder')}
                                    aria-label={searchId}
                                    autoComplete="off"
                                    value={value}
                                    onFocus={onFocus}
                                    ref={ref}
                                    {...rest}
                                />
                            </label>
                        
                        </form>
                    </div>
                )}
            </>
        );
    },
);

export default SearchForm;



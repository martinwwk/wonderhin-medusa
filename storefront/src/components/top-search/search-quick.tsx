import React, {forwardRef} from 'react';
import cn from 'classnames';
import SearchForm from '@/components/top-search/search-form';
import {useSearchHandler} from "@/hooks/use-search-handler";

type SearchBoxProps = {
    className?: string;
    searchId?: string;
    variant?: 'border'| 'dark'| 'fill';
};

const SearchQuick = forwardRef<HTMLDivElement, SearchBoxProps>(
    (
        {
            className,
            searchId = 'search-header',
            variant = 'border',
        },
        ref
    ) => {
        const {
            queryText,
            handleSearch,
            handleAutoSearch,
            clear,
            enableInputFocus,
        } = useSearchHandler();


        return (
            <div
                ref={ref}
                className={cn('hidden lg:block lg:max-w-[200px]', className)}
            >
                <SearchForm
                    searchId={searchId}
                    name={searchId}
                    value={queryText}
                    onSubmit={handleSearch}
                    onChange={handleAutoSearch}
                    onClear={clear}
                    onFocus={enableInputFocus}
                    variant={variant}
                />
            </div>
        );
    }
);

SearchQuick.displayName = 'Search';
export default SearchQuick;

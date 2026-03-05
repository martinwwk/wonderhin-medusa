// SearchResults.tsx
import React from "react";
import {Product} from "@/types/template";
import {AnimatePresence, motion} from "motion/react";
import Container from "@/components/shared/container";
import SearchResultsTrending from "@/components/top-search/searchCards/searchResults-trending";
import SearchResultsSuggestions from "@/components/top-search/searchCards/searchResults-suggestions";
import SearchForm from "@/components/top-search/search-form";
import SearchOverlay from "@/components/top-search/SearchOverlay";
import useBodyScroll from "@/utils/use-body-scroll";

interface Props {
    searchResults?: Product[];
    queryText: string;
    onClear: () => void;
    displaySearch: boolean;
    displayMobileSearch: boolean;
    onSubmit: (e: React.SyntheticEvent) => void;
    onChange: (e: React.FormEvent<HTMLInputElement>) => void;
    onFocus: (e: React.SyntheticEvent) => void;
}

const SearchResults: React.FC<Props> = ({
                                            searchResults,
                                            queryText,
                                            onClear,
                                            displaySearch,
                                            displayMobileSearch,
                                            onSubmit,
                                            onChange,
                                            onFocus,
                                        }) => {

    // Animation variants for the popup
    const popupVariants = {
        hidden: {opacity: 0, y: -150},
        visible: {opacity: 1, y: 0, transition: {duration: 0.3}},
        exit: {opacity: 0, y: -150, transition: {duration: 0.2}},
    };
    useBodyScroll( displaySearch || displayMobileSearch);

    return (
        <>
            <AnimatePresence>
                {(displaySearch || displayMobileSearch) && (
                    <motion.div
                        className="w-full fixed  start-0 bg-white   z-22"
                        variants={popupVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Container>
                            <div className={"flex flex-col py-5 lg:py-10 gap-5"}>
                                {displayMobileSearch && (
                                    <SearchForm
                                        searchId={"mobile-search"}
                                        value={queryText}
                                        onSubmit={onSubmit}
                                        onChange={onChange}
                                        onClear={onClear}
                                        onFocus={onFocus}
                                        variant={"fill"}
                                    />
                                )}
                                {/* End of search */}

                                {/* Search Result*/}
                                {queryText?.length ? (
                                    <SearchResultsSuggestions searchResults={searchResults} queryText={queryText}
                                                              onClear={onClear}/>
                                ) : (
                                    <SearchResultsTrending onClear={onClear}/>
                                )}
                            </div>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
            <SearchOverlay
                displayMobileSearch={displayMobileSearch}
                displaySearch={displaySearch}
                onClick={onClear}
            />
        </>
    );
};

export default SearchResults;

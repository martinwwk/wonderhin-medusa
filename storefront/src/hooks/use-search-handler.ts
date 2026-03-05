'use client';
import React, { useState } from 'react';
import { useUI } from '@/hooks/use-UI';
import {useRouter} from "next/navigation";
import { ROUTES } from '@/utils/routes';
import {useSearchQuery} from "@/hooks/use-search-query";
import { useRegion } from "@/hooks/use-region";

export const useSearchHandler = () => {
    const router = useRouter();
    const {
        displayMobileSearch,
        closeMobileSearch,
        openSearch,
        displaySearch,
        closeSearch,
    } = useUI();
    const [queryText, setQueryText] = useState('');
    const [inputFocus, setInputFocus] = useState<boolean>(false);

    const { data: region } = useRegion();
    const regionId = region?.id;

    const { data: searchResults, isLoading } = useSearchQuery({
        text: queryText,
        regionId,
    });

    function handleSearch(e: React.SyntheticEvent) {
        e.preventDefault();
        clear();
        const route = `${ROUTES.SEARCH}?q=${queryText}`;
        router.push(route);
    }

    function handleAutoSearch(e: React.FormEvent<HTMLInputElement>) {
        setQueryText(e.currentTarget.value);
    }

    function clear() {
       setQueryText('');
        setInputFocus(false);
        closeMobileSearch();
        closeSearch();
    }

    function enableInputFocus() {
        setInputFocus(true);
        if(!displayMobileSearch)  openSearch();
    }

    return {
        queryText,
        setQueryText,
        inputFocus,
        setInputFocus,
        displayMobileSearch,
        displaySearch,
        searchResults,
        isLoading,
        handleSearch,
        handleAutoSearch,
        clear,
        enableInputFocus,
    };
};

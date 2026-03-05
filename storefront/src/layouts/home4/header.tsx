'use client';
import React, {useCallback, useRef} from 'react';
import dynamic from 'next/dynamic';
import { useNavigation } from '@/hooks/use-navigation';
import { useUI } from '@/hooks/use-UI';
import {useActiveScroll} from '@/utils/use-active-scroll';

import Container from '@/components/shared/container';
import Logo from '@/components/shared/logo';
import MenuIcon from '@/components/icons/menu-icon';
import cn from 'classnames';

import MainMenu from '@/layouts/header/main-menu';
import {useSearchHandler} from "@/hooks/use-search-handler";
import SearchResults from "@/components/top-search/searchResults";
import {siteSettings} from "@/data/site-settings";
import Link from "@/components/shared/link";

import SearchForm from "@/components/top-search/search-form";
import AuthDropdown from "@/layouts/header/auth-dropdown";
import CartButton from "@/layouts/header/btn-cart";
import WishlistButton from "@/components/wishlist/wishlist-btn-header";

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({className}) => {
    const {openSidebar, displaySearch, displayMobileSearch} = useUI();
    const { menu } = useNavigation();
    const siteHeaderRef = useRef<HTMLDivElement>(null);

    useActiveScroll(siteHeaderRef as React.RefObject<HTMLElement>);

    const handleMobileMenu = useCallback(() => {
        return openSidebar();
    },[openSidebar]);

    const {
        searchResults,
        clear,
        queryText,
        handleSearch,
        handleAutoSearch,
        enableInputFocus,
    } = useSearchHandler();

    return (
        <>
            <header
                id="siteHeader"
                ref={siteHeaderRef}
                className={cn(
                    'header-four sticky-header sticky top-0 z-50  w-full', className,
                )}
            >
                <div className={"header-sticky"}>
                    <div className="bg-white">
                        <Container variant='fluid'>
                            <div
                                className="grid gap-2  grid-cols-[1fr_auto_1fr] items-center justify-between  py-4 border-b border-border-base">
                                <div className="relative shrink-0 lg:hidden">
                                    <button
                                        aria-label="Menu"
                                        className="p-1"
                                        onClick={handleMobileMenu}
                                    >
                                        <MenuIcon/>
                                    </button>
                                </div>
                                <div className={"store-info hidden lg:flex gap-5 text-sm"}>
                                    <Link href={`tel:${siteSettings.author.phone}`}>
                                        {siteSettings.author.phone}
                                    </Link>
                                    <Link href={`mailto:${siteSettings.author.email}`}>
                                        {siteSettings.author.email}
                                    </Link>
                                </div>
                                <Logo/>
                                {/* End of logo */}


                                <div className='flex gap-2 justify-end-safe'>
                                    <SearchForm
                                        value={queryText}
                                        onSubmit={handleSearch}
                                        onChange={handleAutoSearch}
                                        onClear={clear}
                                        onFocus={enableInputFocus}
                                        useBtnSeach={true}
                                    />
                                    {/* End of search */}

                                    <div
                                        className=" flex justify-end-safe pe-3 xl:pe-5 text-sm space-x-5 xl:space-x-8  xl:min-w-[170px]">
                                        <AuthDropdown hideLabel={true}/>
                                        <WishlistButton hideLabel={true}/>
                                        <CartButton hideLabel={true}/>
                                    </div>
                                    {/* End of auth & lang */}
                                </div>
                            </div>
                        </Container>
                    </div>
                    <div className={"Mainmenu flex justify-center bg-white"}>
                        <MainMenu navigations={menu}/>
                        {/* End of the main menu */}
                    </div>
                </div>
            </header>

            <SearchResults
                displaySearch={displaySearch}
                displayMobileSearch={displayMobileSearch}
                queryText={queryText}
                searchResults={searchResults}
                onClear={clear}
                onSubmit={handleSearch}
                onChange={handleAutoSearch}
                onFocus={enableInputFocus}
            />
            {/* End of conditional search  */}


        </>
    );
}

export default Header;

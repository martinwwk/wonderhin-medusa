"use client";
import React, { useCallback, useRef } from "react";
import { useNavigation } from "@/hooks/use-navigation";
import { useUI } from "@/hooks/use-UI";
import { useActiveScroll } from "@/utils/use-active-scroll";

import Container from "@/components/shared/container";
import Logo from "@/components/shared/logo";
import MenuIcon from "@/components/icons/menu-icon";
import cn from "classnames";

import MainMenu from "@/layouts/header/main-menu";
import HeaderMenutop from "@/layouts/header/header-menutop";

import TopbarItem from "@/layouts/header/header-topbar";
import { useSearchHandler } from "@/hooks/use-search-handler";
import SearchResults from "@/components/top-search/searchResults";
import SearchForm from "@/components/top-search/search-form";
import AuthDropdown from "@/layouts/header/auth-dropdown";
import CartButton from "@/layouts/header/btn-cart";
import WishlistButton from "@/components/wishlist/wishlist-btn-header";
import "@/styles/header.css";

interface HeaderProps {
  className?: string;
}
const Header: React.FC<HeaderProps> = ({ className }) => {
  const { openSidebar, displaySearch, displayMobileSearch } = useUI();
  const { menu, topmenu } = useNavigation();
  const siteHeaderRef = useRef<HTMLDivElement>(null);

  useActiveScroll(siteHeaderRef as React.RefObject<HTMLElement>);

  const handleMobileMenu = useCallback(() => {
    return openSidebar();
  }, [openSidebar]);

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
          "sticky-header sticky top-0 z-50 lg:relative w-full border-b border-border-two dark:border-black/10",
          className,
        )}
      >
        <div className="top-bar bg-brand-dark text-13px text-white ">
          <Container variant="fluid">
            <div className="h-10.5 grid grid-cols-1 lg:grid-cols-2 justify-between items-center ">
              <TopbarItem className="hidden lg:block  relative lg:w-md" />

              <HeaderMenutop
                data={topmenu}
                className="ms-auto "
                classNameLink={"text-white"}
              />
            </div>
          </Container>
        </div>
        <div className="header-sticky bg-white">
          <Container variant="fluid">
            <div className="grid gap-2  grid-cols-[1fr_auto_1fr] items-center justify-between  py-1.5">
              <div className="relative shrink-0 lg:hidden">
                <button
                  aria-label="Menu"
                  className="p-1"
                  onClick={handleMobileMenu}
                >
                  <MenuIcon />
                </button>
              </div>

              <Logo />
              {/* End of logo */}

              <MainMenu navigations={menu} />
              {/* End of the main menu */}

              <div className="flex gap-2 justify-end-safe">
                <SearchForm
                  value={queryText}
                  onSubmit={handleSearch}
                  onChange={handleAutoSearch}
                  onClear={clear}
                  onFocus={enableInputFocus}
                />
                {/* End of search */}

                <div className=" flex justify-end-safe pe-3 xl:pe-5 text-sm space-x-5 xl:space-x-8  xl:min-w-[170px]">
                  <AuthDropdown hideLabel={true} />
                  <WishlistButton hideLabel={true} />
                  <CartButton hideLabel={true} />
                </div>
                {/* End of auth & lang */}
              </div>
            </div>
          </Container>
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
};

export default Header;

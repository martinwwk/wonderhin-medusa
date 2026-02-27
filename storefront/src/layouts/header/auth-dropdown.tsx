"use client"
import React, {useCallback, useRef, useState} from "react"
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react"
import { User, ShoppingBag, Heart,  HelpCircle, LogOut } from "lucide-react"
import AccountIcon from "@/components/icons/account-icon";
import {useRouter} from "next/navigation";
import {ROUTES} from "@/utils/routes";
import {usePanel} from "@/hooks/use-panel";
import {colorMap} from "@/data/color-settings";
import { useModal } from '@/hooks/use-modal';
import { useUI } from '@/hooks/use-UI';
import {useLogoutMutation} from "@/lib/data/template-auth";
import Cookies from "js-cookie";
import cn from "classnames";
type Variant = 'Border' | 'Border-white' | 'Normal';
import Image from "@/components/shared/image";
import { productPlaceholder } from "@/assets/placeholders";
import { useIsMounted } from "@/utils/use-is-mounted";
import { useI18n } from "@lib/hooks/use-i18n";

interface UserDropdownProps {
    hideLabel?: boolean
    userName?: string
    userLocation?: string
    userImage?: string
    variant?: Variant;
}

export default function AuthDropdown({
                                         variant='Normal',
                                         hideLabel,
                                         userName = "Luhan Nguyen",
                                         userLocation = "Los Angeles, CA",
                                         userImage = "/assets/images/support/3.png",
                                     }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { selectedColor } = usePanel();
    const router = useRouter();
    const { openModal } = useModal();
    const { isAuthorized } = useUI();
    const { mutate: logout } = useLogoutMutation();
    const { t } = useI18n();
    const isLoggedIn = isAuthorized ?? !!Cookies.get('auth_token');

    const handleNavigation = useCallback((route: string) => {
        setIsOpen(false);
        buttonRef.current?.click();
        router.push(route);
    }, [router]);
    
    const handleLogout = useCallback(() => {
            setIsOpen(false);
            buttonRef.current?.click();
            logout(undefined, {
                onSuccess: () => {},
                onError: (error) => {
                    console.error('Logout failed:', error.message);
                },
            });
        }, [logout]);

    const handleLogin = useCallback(() => {
        openModal('LOGIN_VIEW');
    }, [openModal]);

    const sizeIcon = variant ==='Border'  ? `w-4 h-4 ${colorMap[selectedColor].text}`:'w-4.5 h-4.5';
    const mounted = useIsMounted();
    
    if (!isLoggedIn && mounted) {
        return (
            <button
                className={cn(
                    'hidden lg:flex items-center focus:outline-none group',
                    hideLabel ? '' : 'text-sm font-normal'
                )}
                onClick={handleLogin}
            >
                <div
                        className={cn(
                            'cart-button',
                            {
                                [`${colorMap[selectedColor].groupHoverBorder} w-11 h-11 flex justify-center items-center rounded-full border-2`]:
                                variant === 'Border',
                            },
                        )}
                    >
                        <AccountIcon className={sizeIcon} />
                    </div>
                {!hideLabel && <span className="text-sm font-normal ms-2">{t('signIn')}</span>}
            </button>
        );
    }
    

    return (
        <Popover className="relative ">
            <PopoverButton
                ref={buttonRef}
                className={`hidden lg:flex items-center h-full  focus:outline-none group `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={cn("cart-button",{
                        [`${colorMap[selectedColor].groupHoverBorder} w-11 h-11 flex justify-center items-center rounded-full border-2 `] : variant ==='Border',
                    },
                        isOpen
                        ? ` ${colorMap[selectedColor].border}`
                        : "border-brand-light/20",
                    )}>
                    <AccountIcon className={sizeIcon}/>
                </div>
                {!hideLabel && (<span className="text-sm font-normal ms-2"> {t('myAccount')}</span>)}
            </PopoverButton>
            
            <PopoverPanel
                transition
                className="absolute end-0 z-10 mt-3 w-70 origin-top-right rounded-md bg-white drop-shadow-dropDown transition duration-200 ease-in-out"
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
            >
                <div className="pt-4">
                    {/* User Profile */}
                    <div className="flex justify-start items-center gap-3 px-4 pb-4 border-b border-gray-100 ">
                        <div className="relative card-img-container">
                            <Image
                                src={userImage ?? productPlaceholder}
                                alt={userName || "Product Image"}
                                width={50}
                                height={50}
                                className="rounded-full w-12"
                            />      
                        </div>
                        
                        <div>
                            <h3 className="font-medium text-brand-dark">{userName}</h3>
                            <p className="text-sm text-gray-500">{userLocation}</p>
                        </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                        <MenuItem icon={<User className="w-5 h-5"/>} label={t('myAccount')}
                                  onClick={() => handleNavigation(ROUTES.ACCOUNT)}/>
                        <MenuItem icon={<ShoppingBag className="w-5 h-5"/>} label={t('myOrder')}
                                  onClick={() => handleNavigation(ROUTES.ORDERS)}/>
                        <MenuItem icon={<Heart className="w-5 h-5"/>} label={t('wishlist')}
                                  onClick={() => handleNavigation(ROUTES.SAVELISTS)}/>
                    </div>
                    
                    <div className="border-t border-gray-100 py-2">
                        <MenuItem icon={<HelpCircle className="w-5 h-5"/>} label={t('help')}/>
                        <MenuItem icon={<LogOut className="w-5 h-5"/>} label={t('logOut')} onClick={handleLogout}/>
                    </div>
                </div>
            </PopoverPanel>
        </Popover>
    )
}

function MenuItem({
                      icon,
                      label,
                      onClick,
                  }: {
    icon: React.ReactNode
    label: string
    onClick?: () => void
}) {
    const { selectedColor } = usePanel();
    return (
        <button className={`flex items-center w-full px-4 py-2.5 text-sm text-body hover:bg-fill-dropdown-hover ${colorMap[selectedColor].hoverLink}`} onClick={onClick}>
            <span className="me-3 ">{icon}</span>
            <span>{label}</span>
        </button>
    )
}


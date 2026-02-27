import React, { FC } from "react";
import { Globe } from 'lucide-react';
import cn from 'classnames';
import { useIsMounted } from "@/utils/use-is-mounted";
import { usePanel } from "@/hooks/use-panel";
import { colorMap } from "@/data/color-settings";
import { useLocale } from "@/lib/hooks/use-i18n";
import { usePathname } from "next/navigation";

interface IProps {
    className?: string;
}

const LanguageSwitcher: FC<IProps> = ({ className }) => {
    const { selectedColor } = usePanel();
    const mounted = useIsMounted();
    const locale = useLocale();
    const pathname = usePathname();

    const handleLanguageSwitch = () => {
        // Toggle between en and zh-TW
        const newLocale = locale === 'en' ? 'zh-TW' : 'en';
        
        // Replace the first segment (current locale) with the new locale
        const segments = pathname.split("/").filter(s => s);
        if (segments.length > 0) {
            segments[0] = newLocale;
        } else {
            segments.unshift(newLocale);
        }
        
        const newPath = "/" + segments.join("/");
        
        // Navigate to new URL
        window.location.href = newPath;
    };

    // Display locale in uppercase for consistency
    const displayLocale = mounted ? (locale === 'zh-TW' ? 'ZH' : 'EN') : 'EN';

    return (
        <div className={cn("menuItem group cursor-pointer mx-2 md:mx-3", className)}>
            <div className="flex items-center h-full">
                <button
                    onClick={handleLanguageSwitch}
                    className={cn(
                        "flex items-center justify-center h-6 gap-1 transition-colors font-base",
                        colorMap[selectedColor].hoverLink
                    )}
                    aria-label="Switch language"
                >
                    <Globe size={15} /> 
                    {displayLocale}
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;

'use client';

import {usePathname} from 'next/navigation';
import {useLogoutMutation} from '@/lib/data/template-auth';
import Link from '@/components/shared/link';
import { usePanel } from "@/hooks/use-panel";
import { colorMap } from "@/data/color-settings";
import cn from "classnames";
import { useI18n } from "@lib/hooks/use-i18n";

type Option = {
    name: string;
    slug: string;
};

export default function AccountNav({
                                       options,
                                   }: {
    options: Option[];
}) {
    const {mutate: logout} = useLogoutMutation();
    const pathname = usePathname();
    const { selectedColor } = usePanel();
    const { t } = useI18n();
    
    return (
        <nav
            className="flex flex-col md:flex-row  border-b  border-border-base  space-x-4 md:space-x-8">
            {options.map((item, index) => {
                return (
                    <Link
                        key={index}
                        href={item.slug}
                        className={cn(
                            "relative  flex items-center cursor-pointer text-sm lg:text-base py-3.5",
                            colorMap[selectedColor].hoverLink,
                            pathname!= item.slug ? "font-semibold " : colorMap[selectedColor].link+ ' ' + colorMap[selectedColor].border+" border-b-2 font-semibold"
                        )}
                       
                    >
                        
                        {t(item.name)}
                    </Link>
                );
            })}
        
        </nav>
    );
}

'use client';
import Link from '@/components/shared/link';
import cn from 'classnames';
import { siteSettings } from '@/data/site-settings';
import React from "react";
import { useTheme } from "next-themes";
import Image from '@/components/shared/image';
import { useIsMounted } from '@/utils/use-is-mounted';

interface Props {
    variant?: "white" | "dark";
    className?: string;
    href?: string;
}

const Logo: React.FC<Props> = ({
    className,
    variant,
    href = siteSettings.logo.href,
    ...props
}) => {
    const mounted = useIsMounted();
    const { theme } = useTheme();

    return (
        <div className={cn('inline-flex focus:outline-none ', className,)}>
            <Link
                href={href}
                {...props}
            >
                {variant === "dark" || mounted && theme === "dark" ? (
                    <Image
                        src={siteSettings.logoBlack.url}
                        alt={siteSettings.logoBlack.alt}
                        width={siteSettings.logoBlack.width}
                        height={siteSettings.logoBlack.height}
                        priority // Add priority to optimize LCP
                    />
                ) : (
                    <Image
                        src={siteSettings.logo.url}
                        alt={siteSettings.logo.alt}
                        width={siteSettings.logo.width}
                        height={siteSettings.logo.height}
                        priority // Add priority to optimize LCP
                    />
                )}
            </Link>
        </div>
    );
};

export default Logo;

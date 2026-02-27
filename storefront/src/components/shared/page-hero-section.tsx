'use client';

import Breadcrumb from '@/components/shared/breadcrumb';
import cn from 'classnames';
import Text from "@/components/shared/text";

interface HeaderProps {
    heroTitle?: string;
    heroSub?: string;
    useBreadcrumb?: boolean;
    variant?: 'default' | 'white';
    className?: string;
}

const PageHeroSection: React.FC<HeaderProps> = ({
                                                    heroTitle = 'text-page-title',
                                                    heroSub,
                                                    variant = 'default',
                                                    className = '',
                                                    useBreadcrumb = true
                                                }) => {
    return (
        <div
            className={cn(
                'flex justify-center min-h-[150px] md:min-h-[180px]  w-full  page-header-banner',
                {
                    'style-variant-white': variant === 'white',
                    'lg:min-h-[240px]': heroSub,
                },
                className
            )}
        
        >
            <div className="relative flex flex-col items-center justify-center text-center lg:max-w-2xl">
                {useBreadcrumb && <Breadcrumb/>}
                <h2
                    className={cn(
                        'text-xl md:text-2xl lg:text-3xl 2xl:text-[32px] font-semibold text-center ',
                            {"mt-2" : useBreadcrumb },
                        {
                            'text-brand-dark': variant === 'default',
                            'text-brand-light': variant === 'white',
                        }
                    )}
                >
                    {heroTitle}
                </h2>
                {heroSub && (
                    <Text variant={'body'} className={cn("pt-2 md:pt-4 mb-0")}>
                       {heroSub}
                    </Text>
                )}

            </div>
        </div>
    );
};

export default PageHeroSection;

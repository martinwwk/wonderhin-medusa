'use client';

import Link from '@/components/shared/link';
import Image from '@/components/shared/image';

import cn from 'classnames';
import Heading from '@/components/shared/heading';
import {siteSettings} from "@/data/site-settings";
import {Tooltip} from "@/components/shared/tooltip";
import { useI18n } from '@/lib/hooks/use-i18n';

interface AboutProps {
    className?: string;
    variant?: string;
    social?: {
        id: string | number;
        path?: string;
        name: string;
        image: string;
        width: number;
        height: number;
    }[];
}

const WidgetAbout: React.FC<AboutProps> = ({social, className, variant}) => {
    const { t } = useI18n();

    return (
        <div className={cn(
            'pb-10 sm:pb-0 ',
            className
        )}
        >
            <div className="text-15px leading-6 mb-3">
                <Heading variant="title" className={cn(' mb-4 lg:mb-5', {
                    'text-white': variant === 'dark',
                })}>
                    {t('helpCustomers')}
                </Heading>

                <div className="mb-4">{t('findLocation')}

                    <Link href={"https://www.google.com/maps"} variant={"reversed"}
                          className={cn("font-semibold text-brand-dark ps-1", {
                              'text-white': variant === 'dark',
                          })}>
                        {t('showOnGoogleMaps')}
                    </Link>

                </div>
                <div className="mb-0">{siteSettings.author.phone}</div>
                <div className="mb-3">{siteSettings.author.email}</div>
            </div>

            {social && (
                <ul className="flex flex-wrap items-center  space-x-4 md:space-s-5 mt-5">
                    {social?.map((item) => (
                        <li
                            className="transition  "
                            key={`social-list--key${item.id}`}
                        >
                            <Tooltip content={item.name} variant={variant}>
                            <Link href={item.path ? item.path : '#'} className={"hover:opacity-80"}>
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    height={item.height}
                                    width={item.width}
                                />
                            </Link>
                            </Tooltip>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default WidgetAbout;

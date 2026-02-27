"use client";
import Image from '@/components/shared/image';
import { siteSettings } from '@/data/site-settings';
import Container from '@/components/shared/container';
import cn from 'classnames';
import Link from "@/components/shared/link";
import Text from "@/components/shared/text";
import React, { useMemo } from "react";
import { useI18n } from '@/lib/hooks/use-i18n';

interface CopyrightProps {
    variant?: "default" | "dark";
    container?: string;
    payment?: {
        id: string | number;
        path?: string;
        name: string;
        image: string;
        width: number;
        height: number;
    }[];
}

const year = new Date().getFullYear();
const Copyright: React.FC<CopyrightProps> = ({
    payment,
    variant,
    container
}) => {
    const { t } = useI18n();
    const containerVariant = useMemo(() => {
        switch (container) {
            case 'small':
                return "Small";
            default:
                return "Normal";
        }
    }, [container]);
    return (
        <div className={cn('  py-5 lg:pb-6 lg:py-7 ', {
            'border-t  xs:border-black/10': variant === 'default',
            'border-t  xs:border-white/10': variant === 'dark',
        })}>
            <Container variant={containerVariant}>
                <div className="flex flex-col gap-2 md:flex-row items-center md:justify-between">
                    <Text>
                        {t('copyright', { year })}&nbsp;
                        <Link variant={'reversed'} href={siteSettings.author.websiteUrl}>
                            {siteSettings.author.name}
                        </Link>

                        &nbsp;{t('allRightsReserved')}
                    </Text>

                    {payment && (
                        <ul className="flex flex-wrap justify-center items-center space-x-2 ">
                            {payment?.map((item) => (
                                <li
                                    className=" transition hover:opacity-80 inline-flex"
                                    key={`payment-list--key${item.id}`}
                                >
                                    <a
                                        href={item.path ? item.path : '/#'}
                                        target="_blank"
                                        className="inline-flex"
                                        rel="noreferrer"
                                    >
                                        <Image
                                            className={"scale-85"}
                                            src={item.image}
                                            alt={item.name}
                                            width={item.width}
                                            height={item.height}
                                        />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

            </Container>
        </div>
    )
        ;
};

export default Copyright;

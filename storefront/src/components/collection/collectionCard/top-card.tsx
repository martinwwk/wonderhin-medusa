'use client';

import Image from '@/components/shared/image';
import Link from '@/components/shared/link';


import { collectionPlaceholder } from '@/assets/placeholders';
import cn from "classnames";

import { Category } from "@/types/template";
import { ROUTES } from '@/utils/routes';
import React from "react";

interface Props {
    category: Category;
    className?: string;
}

const TopCard: React.FC<Props> = ({
    category,
    className = '',
}) => {
    const { name, image, slug } = category;
    return (
        <Link href={`${ROUTES.CATEGORY}/${slug}`} className={cn("flex flex-col gap-3 items-center text-center text-brand-dark", className)}>
            <Image
                src={image?.thumbnail ?? collectionPlaceholder}
                alt={name || ('text-thumbnail')}
                width={185}
                height={185}
                rootClassName={"flex items-center justify-center overflow-hidden rounded-full"}
                className="duration-500 ease-out hover:scale-110"
            />
            <h3 className={`text-base font-semibold `}>
                {name}
            </h3>
        </Link>
    );
};

export default TopCard;

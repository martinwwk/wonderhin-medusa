import React from 'react';
import Image from "@/components/shared/image";
import Link from "@/components/shared/link";
import {StaticImageData} from "next/image";

interface IProps {
    href: string;
    src:string| StaticImageData;
    alt?: string;
}

const CategoryImage: React.FC<IProps> = ({ href, src,alt }) => {
    return (
        <Link
            href={href}
            className="relative block w-full"
        >
            <div className="flex rounded-lg overflow-hidden relative aspect-[330/432] w-full">
                <Image
                    src={src}
                    alt={alt || 'Product Image'}
                    width={330}
                    height={432}
                    variant="cover"
                    className="duration-500 ease-out hover:scale-110 object-cover w-full h-full"
                />
            </div>
        </Link>
    );
};

export default CategoryImage;
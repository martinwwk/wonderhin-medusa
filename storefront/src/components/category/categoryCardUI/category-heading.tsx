import React from 'react';
import Link from "@/components/shared/link";
interface IProps {
    href: string;
    variant?: 'base' | 'drop-shadow' | 'sub' ;
    name?: string;
}
const CategoryHeading: React.FC<IProps> = ({ href, variant, name }) => {
    return (
        <>
            {variant !== 'sub' && (
                <div className={"absolute z-5 px-4 lg:px-9 bottom-8 text-center"}>
                    {
                        variant === 'drop-shadow' ?
                            <Link
                                href={href}
                                className={"font-semibold lg:text-xl xs:!text-brand-light"}>
                                {name}
                            </Link>
                            :
                            <Link
                                variant={"button-white"}
                                href={href}
                                className={"font-semibold  lg:text-base block xs:px-3 min-w-[150px] lg:min-w-[180px]"}>
                                {name}
                            </Link>
                    }
                </div>
            ) }

            {variant === 'sub' && (
                <Link
                    href={href}
                    className={"mt-3 text-sm block text-center font-semibold text-brand-dark"}>
                    {name}
                </Link>
            )}
        </>
    );
};

export default CategoryHeading;
'use client';

import cn from 'classnames';
import Heading from '@/components/shared/heading';
import Text from '@/components/shared/text';
import React from "react";
import Link from "@/components/shared/link";
import {ROUTES} from "@/utils/routes";

interface Props {
  sectionHeading?: string;
  sectionSubHeading?: string;
  className?: string;
  headingPosition?: string;
  showBtnViewAll?: boolean;
}

const SectionHeader: React.FC<Props> = ({
            sectionHeading = 'text-section-title',
            sectionSubHeading = '',
            className = 'mb-5 xl:mb-6',
            showBtnViewAll= false,
            headingPosition = 'left'}) => {
  
    return (
        <div
            className={cn(`${className}`, {
                'text-center block': headingPosition === 'center-xl',
                'flex gap-3 md:gap-7 items-center': headingPosition === 'left',
            })}
        >
            <Heading
                variant="titleMedium"
                useAnimation={true}
                className={cn({
                    'xs:text-2xl lg:text-4xl text-brand-dark': headingPosition === 'left-xl',
                    'xs:text-2xl lg:text-4xl sm:mb-3 text-brand-dark inline-block': headingPosition === 'center-xl',
                })}
                html={sectionHeading}
            />
            {showBtnViewAll && (
                <div className={"font-semibold text-brand-dark"}>
                    <Link variant={"reversed-ani"} href={ROUTES.CATEGORIES}>View All</Link>
                </div>
            )}
            {sectionSubHeading && (
                <Text
                    variant="small"
                    className={cn({
                        'xl:text-15px': headingPosition === 'center-xl',
                    })}
                    useAnimation={true}
                    customDelay={1} // Subheading: 0.2s delay
                >
                    {sectionSubHeading}
                </Text>
            )}

        </div>
    );
};

export default SectionHeader;

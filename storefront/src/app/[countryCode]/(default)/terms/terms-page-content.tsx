'use client';

import Container from '@/components/shared/container';
import {termsCondition} from '@/data/terms-settings';
import Heading from '@/components/shared/heading';
import {useMemo} from "react";

export default function TermsPageContent() {
    const memoizedTerms = useMemo(() => {
        return termsCondition?.map((item) => (
            <div
                key={item.title}
                className="mb-8 lg:mb-12 last:mb-0 order-list-enable"
            >
                <Heading className="mb-4 lg:mb-6 text-lg" variant="title">
                    {item.title}
                </Heading>
                <div
                    className="space-y-5 text-sm leading-7  lg:text-15px"
                    dangerouslySetInnerHTML={{
                        __html: item.description,
                    }}
                />
            </div>
        ));
    }, [termsCondition]);
    return (

        <Container>
            <div className="w-full ">
                {memoizedTerms}
            </div>
        </Container>

    );
}

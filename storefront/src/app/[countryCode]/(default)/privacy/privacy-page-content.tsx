'use client';

import Container from '@/components/shared/container';
import Heading from '@/components/shared/heading';
import {privacyPolicy} from '@/data/privacy-settings';
import {Link, Element} from 'react-scroll';
import {usePanel} from "@/hooks/use-panel";
import {colorMap} from "@/data/color-settings";
import cn from "classnames";
import {ArrowUpRight} from "lucide-react";
import React, {useMemo, useState} from "react";

function makeTitleToDOMId(title: string) {
    return title.toLowerCase().split(' ').join('_');
}

export default function PrivacyPageContent() {
    const {selectedColor} = usePanel();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    
    const  memoizedPrivacyPolicy = useMemo(() => {
        return privacyPolicy?.map((item, index) => (
            <li key={index} className={"border-b border-black/10 last:border-0 group"}>
                <Link
                    spy={true}
                    offset={-120}
                    smooth={true}
                    duration={200}
                    to={makeTitleToDOMId(item.title)}
                    activeClass={cn(colorMap[selectedColor].text)}
                    className="flex items-center justify-between py-4 text-sm text-brand-dark font-medium cursor-pointer lg:text-15px "
                    onSetActive={() => setActiveSection(makeTitleToDOMId(item.title))}
                    onSetInactive={() => setActiveSection(null)}
                >
                    {item.title}
                    <ArrowUpRight size={20} strokeWidth={2}
                                  className={cn(" transition-all ease-in-out duration-300 group-hover:opacity-100 group-hover:translate-x-0",
                                      {
                                          "opacity-100": activeSection === makeTitleToDOMId(item.title),
                                          "opacity-0 -translate-x-5": activeSection !== makeTitleToDOMId(item.title),
                                      }
                                  )}/>
                </Link>
            </li>
        ))
    }, [activeSection, selectedColor]);

    const  memoizedSidebar = useMemo(() => {
        return privacyPolicy?.map((item) => (
            <Element
                name={item.title}
                key={item.title}
                id={makeTitleToDOMId(item.title)}
                className="mb-8 lg:mb-12 last:mb-0 order-list-enable"
            >
                <Heading className="sm:text-lg mb-4 lg:mb-6 font-body" variant="title">
                    {item.title}
                </Heading>
                <div
                    className="space-y-5 text-sm leading-7 lg:text-15px"
                    dangerouslySetInnerHTML={{
                        __html: item.description,
                    }}
                />
            </Element>
        ))
    },[])
    return (
            <Container>
                <div className="flex flex-col md:flex-row gap-5 lg:gap-10">
                    <nav className="hidden mb-8 sm:block md:w-72  ">
                        <ol className=" sticky z-10 md:top-26 lg:top-20   bg-white rounded-lg p-5 border border-black/10">
                            {memoizedPrivacyPolicy}
                        </ol>
                    </nav>
                    {/* End of section scroll spy menu */}

                    <div className="md:w-9/12 ">
                        {memoizedSidebar}
                    </div>
                    {/* End of content */}
                </div>
            </Container>
    );
}

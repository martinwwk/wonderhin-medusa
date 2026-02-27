'use client';
import cn from 'classnames';
import React, {useMemo, useState} from "react";
import Button from "@/components/shared/button";
import SectionHeader from "@/components/common/section-header";
import {useSwiperAnimation} from "@/hooks/use-swiper-animation";
import { motion } from 'motion/react';


interface Props {
    className?: string;
}
// Data structure as provided by the user
const data = [{
        content: '<p>Discover a collection of timeless wardrobe essentials, seamlessly transitioning from work to weekend. Inspired by travel, our America-designed pieces prioritize sustainability with natural fibers and mindful practices. Explore a range of <span style="text-decoration:underline"><strong>tops</strong></span>, <span style="text-decoration:underline"><strong>bottoms</strong></span>, <span style="text-decoration:underline"><strong>sweaters</strong></span>, and accessories in versatile styles, featuring high-quality materials like cotton, linen, tencel, and wool. </p>' +
            '<p>Each piece is crafted with meticulous attention to detail, ensuring a perfect blend of comfort and elegance. Our designs emphasize clean lines and sophisticated silhouettes, making them suitable for any occasion. Whether you’re dressing up for a night out or keeping it casual, our collection offers endless styling possibilities. Embrace the essence of effortless chic with our thoughtfully designed wardrobe staples and experience the harmony of style, quality, and sustainability. Join us in redefining modern fashion with a conscience.</p>'
 }];

const ExpandContent: React.FC<Props> = ({className = 'mb-15 lg:mb-22'}) => {
    const [showMore, setShowMore] = useState(false) // Initially Hide less Information
    
    const { firstParagraphHtml, secondParagraphHtml } = useMemo(() => {
        // Extract the HTML string from the 'content' property of the first object in the data array
        const htmlString = data[0].content
        
        // Split the HTML string into two paragraphs
        // The first </p> tag marks the end of the first paragraph.
        const endOfFirstPTagIndex = htmlString.indexOf("</p>") + 4 // +4 for the length of "</p>"
        
        const firstP = htmlString.substring(0, endOfFirstPTagIndex)
        const secondP = htmlString.substring(endOfFirstPTagIndex)
        
        return { firstParagraphHtml: firstP, secondParagraphHtml: secondP }
    }, []) // Empty dependency array ensures this runs only once on the component mount
    
    const {isInView, slideVariants, ref} = useSwiperAnimation();
    
    return (
        <div className={cn(
            'flex flex-col items-center  ',className
        )}
        >
            <div className="max-w-[940px] w-full text-center">
                <SectionHeader
                    sectionHeading={"Hello! Everyday for Women&apos;s"}
                    headingPosition={'center-xl'}
                />
                <motion.div
                    ref={ref}
                    key={'expand-content'}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    exit="exit"
                >
                    <motion.div
                        custom={0}
                        variants={slideVariants}
                        className=" text-15px leading-7 "
                    >
                        {/* First paragraph (always visible) */}
                        <div dangerouslySetInnerHTML={{ __html: firstParagraphHtml }} />
                        
                        {/* Container for the second paragraph (handles transition) */}
                        {/* Second paragraph (conditionally visible with transition) */}
                        <div
                            className={`
                        transition-all duration-500 ease-in-out overflow-hidden
                        ${showMore ? " mt-3.5 max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
                            dangerouslySetInnerHTML={{ __html: secondParagraphHtml }} />
                    
                    </motion.div>
                    <motion.div
                        custom={1}
                        variants={slideVariants}
                        className={cn("relative pt-7",{
                        "gradient-effect": !showMore,
                    })}
                    >
                        <Button
                            variant="link"
                            onClick={() => setShowMore(!showMore)}
                            className="font-semibold text-base underline"
                        >
                            {showMore ? "Hide less Information" : "See all Information"}
                        </Button>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
};
export default ExpandContent;

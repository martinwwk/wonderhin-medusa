'use client';

import { ChevronDown } from "lucide-react";
import SectionHeader from "@/components/common/section-header";
import { usePanel } from "@/hooks/use-panel";
import { colorMap } from "@/data/color-settings";
import cn from "classnames";
import Link from "@/components/shared/link";
import React, {useMemo} from "react";
import Heading from "@/components/shared/heading";


// Define the category type
type Category = {
    name: string;
    hasDropdown: boolean;
    link: string;
}

// Create the categories array
export const categories: Category[] = [
    { name: "Life Style", hasDropdown: false, link: "/blog/life-style",  },
    { name: "Events", hasDropdown: false, link: "/blog/events" },
    { name: "Inspirations", hasDropdown: false, link: "/blog/inspirations" },
    { name: "Links & Quotes", hasDropdown: false, link: "/blog/links-quotes" },
    { name: "News", hasDropdown: false, link: "/blog/news" },
    { name: "Social", hasDropdown: false, link: "/blog/social" },
    { name: "Uncategorized", hasDropdown: false, link: "/blog/uncategorized",  },
    { name: "Tips & Tricks", hasDropdown: false, link: "/blog/tips-tricks" },
]

interface CategoriesSidebarProps {
    categories?: Category[]
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({
         categories: propCategories = categories,
     }) => {
    const { selectedColor } = usePanel();

    const categoryList = useMemo(() => {
        return propCategories.map((category: Category, index: number) => (
            <div key={`category-${index}`} className="mb-1.5">
                <Link
                    variant="reversed"
                    href={category.link}
                    className={cn("py-1 block", colorMap[selectedColor].hoverLink)}
                >
                    {category.name}
                </Link>
                {category.hasDropdown && <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
        ));
    }, [propCategories, selectedColor]);

    return (
        <div className={`w-full pb-6 border-b last:border-0 border-gray-200`}>
            <Heading variant="titleMedium" className="mb-3">All Categories</Heading>
            <div className="space-y-0 text-sm md:text-15px">
                {categoryList}
            </div>
        </div>
    )
}

export default CategoriesSidebar

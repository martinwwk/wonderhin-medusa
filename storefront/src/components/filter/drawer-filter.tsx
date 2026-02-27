import { useUI } from '@/hooks/use-UI';
import FilterIcon from "@/components/icons/filter-icon";
import {Drawer} from "@/components/common/drawer/drawer";
import motionProps from "@/components/common/drawer/motion";
import FilterSidebar from "@/components/filter/filter-sidebar";
import cn from "classnames";
import {getDirection} from "@/utils/get-direction";
import Button from "@/components/shared/button";
import {CategoryOption} from "@/components/filter/facets/categories-filter";

interface Props {
    setViewAs?: (value: boolean) => void;
    isDesktop?: boolean;
    categories?: CategoryOption[];
    onCategoryChange?: (selectedCategoryIds: string[]) => void;
    onPriceChange?: (value: [number, number]) => void;
}

const DrawerFilter: React.FC<Props> = ({ isDesktop, categories, onCategoryChange, onPriceChange }) => {
    const {openFilter, displayFilter, closeFilter} = useUI();
    const dir = getDirection('en');
    return (
        <>
            <div className={cn("pe-3  mb-3", isDesktop ? '' : 'lg:hidden')}>
                <Button
                    variant={"dark"}
                    className={cn("px-5 !py-2.5 w-[150px] ")}
                    onClick={openFilter}
                >
                    <FilterIcon/>
                    <span className="text-sm ltr:pl-2.5 rtl:pr-2.5">Filter</span>
                </Button>
            </div>
            
            
            {/*TODO: multiple drawer uses throughout the app is a bad practice */}
            <Drawer
                rootClassName={'filter-drawer'}
                placement={dir === 'rtl' ? 'right' : 'left'}
                open={displayFilter}
                onClose={closeFilter}
                
                {...motionProps}
            >
                <FilterSidebar categories={categories} onCategoryChange={onCategoryChange} onPriceChange={onPriceChange} />
            </Drawer>
        </>
    
    );
}
export default DrawerFilter;

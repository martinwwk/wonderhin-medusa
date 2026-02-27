import React, {useCallback} from 'react';
import CompareCardDrawer from '@/components/compare/compare-card-drawer';
import Container from "@/components/shared/container";
import LocalizedClientLink from "@/modules/common/components/localized-client-link";
import {useCompare} from "@/hooks/use-compare";
import { useUI } from '@/hooks/use-UI';
import {ROUTES} from "@/utils/routes";
import { useModal } from '@/hooks/use-modal';
export const MAX_COMPARE= 4;
const CompareDrawer: React.FC = () => {
    const {compareList,removeFromCompare,clearCompare } = useCompare();
  
    const {closeDrawer} = useUI();
    const {closeModal} = useModal();

    const handleClearCompare = useCallback(() => {
        closeDrawer();
        closeModal();
        clearCompare();
    }, [clearCompare, closeDrawer, closeModal]);

    const handleCloseDrawer = useCallback(() => {
        closeDrawer();
        closeModal();
    }, [closeDrawer, closeModal]);

    // Create a removeFromCompareWithCheck function to check for an empty list
    const handleRemoveFromCompare = useCallback((id: number) => {
        removeFromCompare(id);
        if (compareList.length === 1) {
            closeDrawer();
            closeModal();
        }
    }, [compareList, removeFromCompare, closeDrawer, closeModal]);

    return (
        <>
            {compareList.length > 0 && (
                <Container>
                    <div className=' flex justify-between text-black py-3'>
                        <div className="flex items-center text-sm">
                            Compare ({compareList.length})
                            {compareList.length === MAX_COMPARE && (
                                <div className="text-red-500 ps-2"> You can only compare up to 4 items</div>
                            ) }
                        </div>
                        <div className="text-sm flex items-center space-x-10">
                            <div className=" button">
                                <button onClick={handleClearCompare}>
                                    <span className="c-button__text ">Clear All</span>
                                </button>
                            </div>
                            <div className="c-cta button">
                                <LocalizedClientLink href={ROUTES.COMPARE}
                                      onClick={handleCloseDrawer}
                                      className="block leading-6 px-4 py-1 bg-brand-dark hover:bg-brand-dark/90 rounded text-white text-sm font-medium items-center justify-center focus:outline-none focus-visible:outline-none"
                                >
                                    Compare
                                </LocalizedClientLink>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4  gap-2 md:gap-5 mb-4">
                        {compareList.map((product) => (
                            <CompareCardDrawer
                                key={product.id}
                                product={product}
                                removeCompare={handleRemoveFromCompare}
                                useReview={false}
                            />
                         ))}
                    </div>
                
                </Container>
            )}
        </>
    )
    
};

export default CompareDrawer;

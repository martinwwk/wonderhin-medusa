// big-deal-product.tsx
'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import CompareCardDrawer from "@/components/compare/compare-card-drawer";
import Button from "@/components/shared/button";
import {X} from "lucide-react";
import {Product} from "@/types/template";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    productList?: Product[]; // Adjust type based on your Product type from types.tsx
}

const BigDealProduct: React.FC<Props> = ({ isOpen, onClose, productList }) => {
    // Animation variants for the popup
    const popupVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: 50, transition: { duration: 0.2 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className=" absolute top-0 bottom-0 start-0 p-3 xl:p-7.5 flex items-end justify-center z-50"
                    onClick={onClose} // Close when clicking outside
                >
                    <motion.div
                        className="bg-white p-3 lg:p-5 rounded-lg shadow-lg  max-w-md w-full"
                        variants={popupVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={"relative border-b border-black/7 pb-3 mb-3 px-3 -mx-3 lg:mb-5 lg:px-5 lg:-mx-5"}>
                            <h4 className="text-lg font-semibold text-brand-dark">Shop the Look</h4>
                            <Button
                                variant="border"
                                className="absolute -top-1 end-3 z-10 xs:p-1  xs:rounded-full xs:border-0  !text-brand-dark hover:bg-gray-200"
                                onClick={onClose}
                            >
                                <X size={19} strokeWidth={2} />
                                <span className="sr-only">Close</span>
                            </Button>
                        </div>
                        <div className={"space-y-2 lg:space-y-4"}>
                            {productList?.map((product) => (
                                <CompareCardDrawer
                                    key={product.id}
                                    product={product}
                                    variant={"rounded"}
                                    
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BigDealProduct;
import React, {useCallback} from "react";
import Button from "@/components/shared/button";
import { useModal } from '@/hooks/use-modal';
import {Product} from "@/types/template";
import {Tooltip} from "@/components/shared/tooltip";
import {Eye} from "lucide-react";

interface ProductActionsProps {
    product : Product;
}

const BtnQuickview: React.FC<ProductActionsProps> = ({
                                                         product,
                                                       }) => {
    const { openModal } = useModal();
    const handlePopupView = useCallback(() =>{
        openModal("PRODUCT_VIEW", product);
    },[openModal, product])
    
    return (
        <Tooltip content={"Quickview"} className={"min-w-30 "} position={"left"}>
        <Button
            variant={"white-w45"}
            aria-label="Quick View Button"
            onClick={handlePopupView}
        >
            <Eye size={18} strokeWidth={1} />
        </Button>
        </Tooltip>
    );
};

export default BtnQuickview;
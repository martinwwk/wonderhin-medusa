import {useCompare} from "@/hooks/use-compare";
import {Tooltip} from "@/components/shared/tooltip";
import {Check, GitCompare} from "lucide-react";
import { useUI } from '@/hooks/use-UI';
import {useCallback, useMemo} from "react";
import {Product} from "@/types/template";
import Button from "@/components/shared/button";
interface Props {
    product : Product;
    variant?: string;
}

const CompareButton: React.FC<Props> = ({product, variant}) => {
    const {compareList,addToCompare } = useCompare();

    const {openDrawer, setDrawerView} = useUI();
    const isInCompare = useMemo(() => {
        return compareList.some((p) => p.id === product.id);
    }, [compareList, product.id]);
    const compareStatus = isInCompare ? 'Browse compares ' : 'Compares';

    const btnVariant = useMemo(() => {
        if (variant === 'mercury') return 'white-w45';
        return 'compare-pdp';
    }, [variant]);

    const position = useMemo(() => {
        if (variant === 'mercury') return 'left';
        return 'top';
    }, [variant]);

    const handleOpenCompareDrawer = useCallback(() => {
        setDrawerView('COMPARE_SIDEBAR');
        openDrawer();
    }, [setDrawerView, openDrawer]);

    const handleAddToCompare = useCallback(() => {
        addToCompare(product);
        handleOpenCompareDrawer();
    }, [addToCompare, product, handleOpenCompareDrawer]);

    return (
        <Tooltip content={compareStatus} className={"min-w-32"} position={position}>
            {isInCompare ? (
                <Button
                    variant={btnVariant}
                    className={"xs:bg-brand-dark xs:text-white"}
                    onClick={handleOpenCompareDrawer}
                >
                    
                    <Check size={18} strokeWidth={1} />
                </Button>
            ) : (
                <Button
                    variant={btnVariant}
                    onClick={handleAddToCompare}
                >
                    <GitCompare size={18} strokeWidth={1} />
                </Button>
            )}
        </Tooltip>
    );
}
export default CompareButton;

import React, {useCallback} from "react";
import Image from "@/components/shared/image";
import { Product } from "@/types/template";
import { productPlaceholder } from "@/assets/placeholders";
import Button from "@/components/shared/button";
import { X } from "lucide-react";

interface CompareImageProps {
    product: Product;
    removeCompare: (id: number) => void;
}

const CompareImage: React.FC<CompareImageProps> = ({ product, removeCompare }) => {
    const { name, image, id } = product;
    const handleRemove = useCallback(() => {
        removeCompare?.(id as number);
    }, [removeCompare, id]);
    return (
        <div className="relative py-5">
            <Button
                variant="border"
                className="absolute top-3 right-0 z-10 xs:p-2 xs:h-9 xs:rounded-full xs:border-0 bg-gray-200 !text-brand-dark"
                onClick={handleRemove}
            >
                <X size={20} strokeWidth={2} />
                <span className="sr-only">Remove from comparison</span>
            </Button>
            <div className="relative overflow-hidden  w-full">
                <Image
                    src={image?.thumbnail ?? productPlaceholder}
                    alt={name || "Product Image"}
                    width={400}
                    height={540}
                />
            </div>
        </div>
    );
};

export default CompareImage;
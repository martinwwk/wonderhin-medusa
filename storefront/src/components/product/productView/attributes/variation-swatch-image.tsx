import React from "react";
import cn from "classnames";
import { Tooltip } from "@/components/shared/tooltip";
import { VariationItem} from "@/types/template";
import Image from "@/components/shared/image";
import { productPlaceholder } from "@/assets/placeholders";

interface VariationSwatchImageProps {
    variationName: string;
    options: VariationItem[];
    selectedValue?: string;
    onSelect: (variationName: string, value: string) => void;
}

const VariationSwatchImage: React.FC<VariationSwatchImageProps> = ({
                                                                       variationName,
                                                                       options,
                                                                       selectedValue,
                                                                       onSelect,
                                                                   }) => (
    <div className="flex flex-wrap gap-3">
        {options.map((option) => (
            <Tooltip
                content={option.value}
                key={option.id}
                rootclassName={cn(
                    "p-1 border bg-white rounded-full",
                    selectedValue === option.value
                        ? "border-gray-500 drop-shadow-variant"
                        : "border-gray-300 hover:border-gray-500"
                )}
            >
                <div
                    className={cn(
                        "relative cursor-pointer w-12 h-12 rounded-full overflow-hidden ",
                    )}
                    onClick={() => onSelect(variationName, option.value)}
                >
                    <Image
                        src={option.image ?? productPlaceholder}
                        width={100}
                        height={113}
                        alt={option.value || "Product Image"}
                    />
                    <span className="sr-only">{option.value}</span>
                </div>
            </Tooltip>
        ))}
    </div>
);

export default VariationSwatchImage;
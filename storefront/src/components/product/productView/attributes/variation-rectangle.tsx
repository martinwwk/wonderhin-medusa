import React from "react";
import cn from "classnames";
import { VariationItem } from "@/types/template";

interface VariationRectangleProps {
    variationName: string;
    options: VariationItem[];
    selectedValue?: string;
    onSelect: (variationName: string, value: string) => void;
}

const VariationRectangle: React.FC<VariationRectangleProps> = ({
                                                                   variationName,
                                                                   options,
                                                                   selectedValue,
                                                                   onSelect,
                                                               }) => (
    <div className="flex flex-wrap gap-3">
        {options.map((option) => (
            <button
                key={option.id}
                onClick={() => onSelect(variationName, option.value)}
                className={cn(
                    "min-w-[50px] h-10 px-4 rounded text-15px font-medium border transition",
                    selectedValue === option.value
                        ? "bg-brand-dark text-white border-brand-dark drop-shadow-variant"
                        : "bg-white text-brand-dark border-gray-300 hover:border-brand-dark"
                )}
            >
                {option.value}
            </button>
        ))}
    </div>
);

export default VariationRectangle;
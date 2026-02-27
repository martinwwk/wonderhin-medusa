import React from "react";
import cn from "classnames";
import { Tooltip } from "@/components/shared/tooltip";
import { VariationItem } from "@/types/template";

interface VariationSwatchProps {
    variationName: string;
    options: VariationItem[];
    selectedValue?: string;
    onSelect: (variationName: string, value: string) => void;
}

const VariationSwatch: React.FC<VariationSwatchProps> = ({
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
                        "relative cursor-pointer w-6 h-6 rounded-full border border-brand-dark/8"
                    )}
                    style={{ backgroundColor: option.value.toLowerCase() }}
                    onClick={() => onSelect(variationName, option.value)}
                    aria-label={`Select ${option.value} color`}
                >
                    <span className="sr-only">{option.value}</span>
                </div>
            </Tooltip>
        ))}
    </div>
);

export default VariationSwatch;
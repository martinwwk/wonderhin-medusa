import cn from "classnames";
import {IconType} from "@/types/template";
import React from "react";

const EffortlessIcon: React.FC<IconType> = ({
                         color = 'currentColor',
                         width = '40',
                         height = '40',
                         className = '',
                     }) => {
    return (
        <svg width={width} height={height} className={cn(className, color)} viewBox="0 0 40 40" fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <g id="icon">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M14.6133 23.3283C13.7895 23.0227 13.0587 22.4248 12.5937 21.5744C11.5307 19.6344 12.1818 17.1099 14.0685 15.9406L17.1778 14.014C19.0512 12.8447 21.4695 13.4825 22.5325 15.4091C23.5955 17.349 22.9444 19.8736 21.0576 21.0429L20.6457 21.3352" id="Vector"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M25.4718 16.605C26.2956 16.9106 27.0264 17.5085 27.4915 18.3589C28.5545 20.2988 27.9034 22.8234 26.0166 23.9927L22.9074 25.9193C21.0339 27.0886 18.6156 26.4508 17.5527 24.5241C16.4897 22.5842 17.1407 20.0597 19.0275 18.8904L19.4395 18.5981" id="Vector_2"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M20.0007 36.6667C29.2054 36.6667 36.6673 29.2048 36.6673 20C36.6673 10.7953 29.2054 3.33337 20.0007 3.33337C10.7959 3.33337 3.33398 10.7953 3.33398 20C3.33398 29.2048 10.7959 36.6667 20.0007 36.6667Z" id="Vector_3"></path>
            </g>
        </svg>
    
    );
};

export default EffortlessIcon;

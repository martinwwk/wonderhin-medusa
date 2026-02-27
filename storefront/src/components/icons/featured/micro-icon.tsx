import cn from "classnames";
import {IconType} from "@/types/template";

const MicroIcon: React.FC<IconType> = ({
                      color = 'currentColor',
                      width = '40',
                      height = '40',
                      className = '',
                  }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 40" className={cn(className, color)} fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <g id="icon">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M20.0007 25.8334C23.684 25.8334 26.6673 22.85 26.6673 19.1667V10C26.6673 6.31671 23.684 3.33337 20.0007 3.33337C16.3173 3.33337 13.334 6.31671 13.334 10V19.1667C13.334 22.85 16.3173 25.8334 20.0007 25.8334Z" id="Vector"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M7.25 16.0834V18.9167C7.25 25.95 12.9667 31.6667 20 31.6667C27.0333 31.6667 32.75 25.95 32.75 18.9167V16.0834" id="Vector_2"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M17.6836 10.7167C19.1836 10.1667 20.8169 10.1667 22.3169 10.7167" id="Vector_3"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M18.666 14.25C19.5493 14.0166 20.466 14.0166 21.3493 14.25" id="Vector_4"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M20 31.6666V36.6666" id="Vector_5"></path>
            </g>
        </svg>
    
    );
};

export default MicroIcon;

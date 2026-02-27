import cn from "classnames";
import {IconType} from "@/types/template";
const SoundIcon: React.FC<IconType> = ({
                          color = 'currentColor',
                          width = '40',
                          height = '40',
                          className = '',
                      }) => {
    return (
        <svg
            height={height}
            width={width}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(className,color)}
        >

            <g id="icon">
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M23.5509 18.9C24.2009 16.1666 21.8175 13.7832 19.0842 14.4332C17.8009 14.7499 16.7509 15.7999 16.4342 17.0833C15.7842 19.8166 18.1675 22.1999 20.9009 21.5499C22.2009 21.2332 23.2509 20.1833 23.5509 18.9Z" id="Vector"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M30.0163 28.65C32.8663 25.9834 34.6496 22.2 34.6496 17.9833C34.6496 9.88334 28.0829 3.33337 19.9996 3.33337C11.9163 3.33337 5.34961 9.9 5.34961 17.9833C5.34961 22.2167 7.14961 26.0333 10.0329 28.7" id="Vector_2"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M13.333 24.2499C11.7996 22.6166 10.8496 20.4166 10.8496 17.9832C10.8496 12.9332 14.9496 8.83325 19.9996 8.83325C25.0496 8.83325 29.1496 12.9332 29.1496 17.9832C29.1496 20.4166 28.1996 22.5999 26.6663 24.2499" id="Vector_3"></path>
                <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#111111" d="M17.1659 27.7666L14.7659 30.75C12.8659 33.1333 14.5492 36.6499 17.5992 36.6499H22.3825C25.4325 36.6499 27.1326 33.1166 25.2159 30.75L22.8159 27.7666C21.3826 25.9499 18.6159 25.9499 17.1659 27.7666Z" id="Vector_4"></path>
            </g>
        
        </svg>
    );
};

export default SoundIcon;

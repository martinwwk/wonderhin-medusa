import cn from "classnames";
import {IconType} from "@/types/template";

const BoxIcon: React.FC<IconType> = ({
  color = 'currentColor',
  width = '28',
  height = '28',
  className = '',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className,color)}
    >
      <path d="M20.249 15.55v-4.575L8.386 4.125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M2.962 8.3 14 14.687l10.962-6.35M14 26.013V14.675" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M11.412 2.1 4.737 5.813c-1.512.837-2.75 2.937-2.75 4.662v7.063c0 1.724 1.238 3.825 2.75 4.662l6.675 3.713c1.425.787 3.763.787 5.188 0l6.675-3.713c1.512-.837 2.75-2.938 2.75-4.662v-7.063c0-1.725-1.238-3.825-2.75-4.662L16.6 2.1c-1.438-.8-3.763-.8-5.188 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
};

export default BoxIcon;

import { IoClose } from 'react-icons/io5';
import cn from 'classnames';

type ButtonEvent = (
  e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
) => void;

interface CloseButtonProps {
  className?: string;
  onClick?: ButtonEvent;
}

const CloseButton: React.FC<CloseButtonProps> = ({ className, onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Close Button"
      className={cn(
        'absolute z-10 inline-flex items-center justify-center w-8 h-8  transition duration-200 text-brand-dark text-opacity-50 focus:outline-none  hover:text-opacity-100 -top-3  lg:top-2   -end-2 md:-end-3  lg:end-3  bg-background lg:bg-transparent hover:bg-gray-200 rounded-full',
        className,
      )}
    >
      <IoClose className="text-xl lg:text-2xl" />
    </button>
  );
};

export default CloseButton;

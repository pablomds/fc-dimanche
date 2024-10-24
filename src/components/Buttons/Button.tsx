import { MouseEventHandler } from "react";

interface IndexProps {
    buttonText: string;
    className?: string;
    isDisabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

const Button: React.FC<IndexProps> = ({ buttonText, className, isDisabled, onClick }) => {
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`flex items-center justify-center ${className} ${isDisabled ? 'cursor-not-allowed opacity-50 bg-gray-300' : 'transition ease-in-out delay-150 md:hover:-translate-y-1 md:hover:scale-110 duration-300'} drop-shadow-2xl rounded-full text-lg md:text-xl font-semibold  select-none`}
    >
      {`${buttonText}`}
    </button>
  );
}

export default Button;
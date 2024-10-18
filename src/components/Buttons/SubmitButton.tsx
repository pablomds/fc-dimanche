
interface IndexProps {
  isSubmitting: boolean;
  buttonText: string;
  className?: string;
}

const SubmitButton: React.FC<IndexProps> = ({ isSubmitting, buttonText, className }) => {
  return (
    <div className={`p-4 h-20 w-full md:w-72 md:h-20 flex items-center justify-center ${className}`}>
      <button
        type="submit"
        className="drop-shadow-2xl rounded-full h-full w-full text-xl text-[#FFFFFF] bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] font-semibold transition ease-in-out delay-150 md:hover:-translate-y-1 md:hover:scale-110 hover:bg-indigo-500 duration-300"
      >
        {isSubmitting ? (
          <div className="flex space-x-2 justify-center items-center">
            <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-4 w-4 bg-white rounded-full animate-bounce"></div>
          </div>
        ) : (
          `${buttonText}`
        )}
      </button>
    </div>
  );
}

export default SubmitButton
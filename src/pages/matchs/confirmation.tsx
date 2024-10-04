import { useRef, useState } from 'react';
import confirmationIconMatchCreationSvg from '../../assets/matchs/ConfirmationIconMatchCreation.svg';
import { IoIosShareAlt } from "react-icons/io";
import { IoIosCopy } from "react-icons/io";





const confirmation = () => {
  const [isHighlighted, setIsHighlighted] = useState(false); // Gérer le surlignage
  const inputRef = useRef<HTMLInputElement>(null); // Typing the ref as HTMLInputElement

  const handleCopy = () => {
    const input = inputRef.current;
    if (!input) return;
    input.select(); // Select the text in the input
    input.setSelectionRange(0, 99999); // For mobile devices

    try {
        navigator.clipboard.writeText(input.value) // Copy the text to clipboard
        setIsHighlighted(true)
    } catch (error) {
        console.error("Erreur lors de la copie : ", error)
    }
  };

  return (
    <section className="bg-cover bg-center lg:bg-img-match-creation bg-img-match-confirmation-mobile bg-slate-600 h-screen w-screen overflow-y-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center px-4 lg:px-0">
        <div className="min-h-[540px] md:w-1/2 md:h-3/5 lg:w-1/2 lg:max-w-[555px] lg:h-4/5 lg:max-h-[808px] px-4 lg:px-6 bg-[#FFFFFF] rounded-lg flex flex-col items-center justify-start shadow-xl">
          <div className="flex flex-col mb-6 sm:mb-7 md:mb-9 lg:mb-10 xl:mb-11">
            <div className="flex justify-center items-center mb-4 mt-4 md:mt-8 md:mb-8 lg:mt-16 lg:mb-16 ">
              <img
                src={confirmationIconMatchCreationSvg}
                className="w-48 h-48 md:h-56 md:w-56 lg:h-72 lg:w-72"
                alt="Confirmation Icon SVG"
              />
            </div>
            <div className="flex flex-col justify-center items-center space-y-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
                Vous avez confirmé le match :
              </h1>
              <div className="flex flex-col justify-center text-green-600 text-sm md:text-base lg:text-xl ">
                <p>
                  Le <span className="font-semibold">15/08/2025</span> à{" "}
                  <span className="font-semibold">17h30</span>
                </p>
                <p>
                  à{" "}
                  <span className="font-semibold">
                    rue des moulins, barbes 93000
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-[#D9D9D9]/30 border-[#D9D9D9] border-solid border-2 w-full rounded-lg">
            <div className="h-14 sm:h-14 md:h-16 lg:h-20 flex items-center space-x-2 px-2 transition duration-150 ease-in-out hover:text-green-500 cursor-pointer">
              <IoIosShareAlt className="h-8 w-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
              <span className="text-xs sm:text-sm md:text-base lg:text-xl font-medium">
                Partager
              </span>
            </div>
            <div className="border-b border-[#D9D9D9] my-2" />
            <div
              onClick={handleCopy}
              className="h-14 sm:h-14 md:h-16 lg:h-20 flex items-center space-x-2 px-2"
            >
              <IoIosCopy
                className={`h-8 w-8 md:w-10 md:h-10 lg:w-14 lg:h-14 transition duration-150 ease-in-out hover:text-green-500 cursor-pointer ${
                  isHighlighted && "text-green-500"
                }`}
              />

              <input
                type="text"
                readOnly
                ref={inputRef}
                value="https://tinyurl.com/yudwdjex"
                className="flex-grow bg-slate-600/10 border-2 border-slate-600/30 p-2 rounded-xl w-full text-xs sm:text-sm md:text-base lg:text-xl font-medium focus:drop-shadow-lg outline-slate-600/80 h-2/3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default confirmation
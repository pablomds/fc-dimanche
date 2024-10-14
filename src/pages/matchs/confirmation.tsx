import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confirmationIconMatchCreationSvg from '../../assets/matchs/ConfirmationIconMatchCreation.svg';
import { updateMatch, getMatch } from '../../controllers/matchControllers';
import { utils } from '../../utils/utils';
import { useLocation } from 'react-router-dom';
import { IoIosShareAlt } from "react-icons/io";
import { IoIosCopy } from "react-icons/io";
import { Match } from '../../models/Match';
import { useNavigate } from 'react-router-dom';
import { MdFolderOff } from "react-icons/md";
import { TbCalendarClock } from "react-icons/tb";



const confirmation = () => {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invitationLink, setInvitationLink] = useState<string>("");
  const [isMatchNotFound, setIsMatchNotFound] = useState<boolean>(false);
  const [isEventDatePassed, setIsEventDatePassed] = useState<boolean>(false);
  const [match, setMatch] = useState<Match>();
  const inputRef = useRef<HTMLInputElement>(null); // Typing the ref as HTMLInputElement
  const location = useLocation();  // Hook to access URL

  const navigate = useNavigate();

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

  const handleShare = async () => {
    // Check if the Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Ça va chauffer sur le terrain !",
          text: "Prêt à taper dans le ballon ? Rejoins-nous pour un match de foot entre amis.",
          url: invitationLink, 
        });
        console.log("Content shared successfully!");
      } catch (error) {
        console.error("Error sharing content:", error);
      }
    } else {
      alert("Ton navigateur ne supporte pas l'option de partage.");
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {

        const currentTimestamp = utils.getUnixTimeStamp(new Date());
        const searchParams = location.search;
        const matchID = searchParams.startsWith('?') ? searchParams.slice(1) : searchParams;
  
        if (!utils.isValidFirestoreId(matchID)) {
          navigate('/not-found')
          return;
        }
  
        const match = await getMatch(matchID);

        if (!match.id) {
          setIsMatchNotFound(true);
          return;
        }

        if (currentTimestamp > match.eventDateTime) {
          setIsEventDatePassed(true);
          return;
        }
  
        if (!match.isConfirmed) {
          match.isConfirmed = true;
          await updateMatch(match.id, match)
        } 

        setMatch(match);
        setInvitationLink(`${import.meta.env.VITE_BASE_URL}/match/invitation?${match.id}`)

      } catch (error) {
        console.error("Erreur lors de la confirmation", error);
      } finally {
        setIsLoading(false); // Ensure loading state is handled properly
      }
    };
  

    fetchData();

  },[])

  return (
    <section className="bg-cover bg-center lg:bg-img-match-creation bg-img-match-confirmation-mobile h-screen w-screen overflow-y-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center px-4 lg:px-0">
        <div className="min-h-[540px] max-w-[320px] md:w-1/2 md:h-3/5 lg:w-1/2 lg:max-w-[555px] lg:h-4/5 lg:max-h-[808px] px-4 lg:px-6 bg-[#FFFFFF] rounded-lg flex flex-col items-center justify-start shadow-xl">
          <div className="flex flex-col mb-6 sm:mb-7 md:mb-9 lg:mb-10 xl:mb-11">
            <div className="flex justify-center items-center mb-4 mt-4 md:mt-8 md:mb-8 lg:mt-16 lg:mb-16">
              {isEventDatePassed && (
                <TbCalendarClock className="w-48 h-48 md:h-56 md:w-56 lg:h-72 lg:w-72 text-[#E51818]" />
              )}
              {isMatchNotFound && (
                <MdFolderOff className="w-48 h-48 md:h-56 md:w-56 lg:h-72 lg:w-72 text-[#04100D]" />
              )}
              {match?.isConfirmed && (
                <img
                  src={confirmationIconMatchCreationSvg}
                  className="w-48 h-48 lg:h-64 lg:w-64"
                  alt="Confirmation Icon SVG"
                />
              )}
            </div>
            <div className="flex flex-col justify-center items-center space-y-4">
              {isMatchNotFound && (
                <h1 className="text-xl lg:text-2xl font-semibold text-center">
                  Oups ! Il n'y a aucun résultat dans notre base de données.
                </h1>
              )}
              {isEventDatePassed && (
                <h1 className="text-xl md:text-2xl lg:text-3xl text-center font-semibold text-[#E51818] my-4">
                  Ce match est déjà passé vous ne pouvez plus le valider.
                </h1>
              )}
              {match?.isConfirmed && (
                <>
                  <h1 className="text-xl lg:text-3xl font-semibold text-center">
                    Vous avez confirmé le match :
                  </h1>
                  <div className="flex flex-col justify-center text-green-600 text-sm md:text-base lg:text-xl text-center">
                    <p>
                      Le{" "}
                      <span className="font-semibold">
                        {match?.eventDateTime
                          ? utils.formatUnixTimeStampToDDMMYY(
                              match.eventDateTime
                            )
                          : "15/08/24"}
                      </span>{" "}
                      à{" "}
                      <span className="font-semibold">
                        {match?.eventDateTime
                          ? utils.formatUnixTimeStampToHours(
                              match.eventDateTime
                            )
                          : "17h30"}
                      </span>
                    </p>
                    <p>
                      à{" "}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${match?.eventLocation}`}
                        target="_blank"
                        className="font-semibold underline underline-offset-1"
                      >
                        {match?.eventLocation}
                      </a>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          {(isMatchNotFound  ||  isEventDatePassed) && (
              <div className="mt-8 mb-6">
                <Link
                  to="/match/creation"
                  className="flex justify-center drop-shadow-2xl rounded-full p-4 w-60 h-14 text-base text-[#FFFFFF] bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                >
                  Créer le match
                </Link>
              </div>
            )}
          {match?.isConfirmed && (
            <div className="flex flex-col bg-[#D9D9D9]/30 border-[#D9D9D9] border-solid border-2 w-full rounded-lg">
              <div className="h-14 sm:h-14 md:h-14 lg:h-20 flex items-center space-x-2 px-2 transition duration-150 ease-in-out hover:text-green-500 cursor-pointer">
                <IoIosShareAlt className="h-8 w-8 md:w-10 md:h-10 lg:w-14 lg:h-14" />
                <span onClick={handleShare} className="text-xs sm:text-sm md:text-base lg:text-xl font-medium">
                  Partager
                </span>
              </div>
              <div className="border-b border-[#D9D9D9] my-2" />
              <div
                onClick={handleCopy}
                className="h-14 sm:h-14 md:h-14 lg:h-20 flex items-center space-x-2 px-2"
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
                  value={invitationLink}
                  className="flex-grow bg-slate-600/10 border-2 border-slate-600/30 p-2 rounded-xl w-full text-xs sm:text-sm md:text-base lg:text-xl font-medium focus:drop-shadow-lg outline-slate-600/80 h-2/3"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default confirmation
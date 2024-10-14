import backgroundImageHomePageSvg from '../../assets/homepage/BackgroundImageHomePage.svg';
import fcSvg from '../../assets/homepage/FC.svg';
import dimancheSvg from '../../assets/homepage/DIMANCHE.svg';
import { useNavigate } from 'react-router-dom';

const index = () => {

  const navigate = useNavigate();

  return (
    <section
      className="bg-cover bg-center h-screen select-none"
      style={{ backgroundImage: `url(${backgroundImageHomePageSvg})` }}
    >
      <div className="flex flex-col justify-center items-center h-screen container mx-auto px-4">
        <div className="absolute h-32 lg:h-40 lg:w-full top-0 left-0 right-0 flex flex-col mt-2">
          <div className="flex h-full w-full justify-center items-center">
            <img
              src={fcSvg}
              alt="FC"
              className="lg:mr-4 h-20 w-20 lg:h-40 lg:w-40 animate-fcAnimation"
            />
            <img
              src={dimancheSvg}
              alt="DIMANCHE"
              className="ml-2 lg:ml-4 h-72 w-72 lg:h-[30rem] lg:w-[30rem] animate-dimancheAnimation opacity-0"
            />
          </div>
          <div className="lg:mt-2 h-1/2 w-full flex justify-center text-center animate-apparition opacity-0">
            <h1
              className="text-xl md:text-2xl lg:text-[1.90rem] font-semibold text-[#FFFFFF] mx-2"
              style={{ textShadow: "2px 2px 6px black" }}
            >
              L’application parfaite pour organiser vos matchs entre amis !
            </h1>
          </div>
        </div>
        <button onClick={() => navigate('/match/creation')} className="relative rounded-full p-4 w-80 h-28 text-3xl text-[#FFFFFF] font-semibold overflow-hidden group transition-colors duration-500 animate-apparitionButton opacity-0">
          <span className="relative z-10">CREER VOTRE MATCH</span>
          <div className="absolute inset-0 bg-[#04100D] transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"></div>
          <div className="absolute inset-0 border-[6px] border-[#FFFFFF] rounded-full transition-colors duration-500 ease-in-out group-hover:border-[#04100D]"></div>
        </button>
      </div>
    </section>
  );
}

export default index
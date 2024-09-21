import backgroundImageHomePageSvg from '../../assets/homepage/BackgroundImageHomePage.svg';
import backgroundImageHomePageMobileSvg from '../../assets/homepage/backgroundImageHomePageMobile.svg'
import fcSvg from '../../assets/homepage/FC.svg';
import dimancheSvg from '../../assets/homepage/DIMANCHE.svg';

const index = () => {
  return (
    <section
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${backgroundImageHomePageSvg})` }}
    >
      <div className="flex flex-col justify-center items-center h-screen container mx-auto px-4">
        <div className="absolute h-32 lg:h-40 lg:w-full top-0 left-0 right-0 flex flex-col mt-2">
          <div className="flex h-full w-full justify-center items-center">
            <img
              src={fcSvg}
              alt="FC"
              className="mr-4 h-20 w-20 lg:h-40 lg:w-40"
            />
            <img
              src={dimancheSvg}
              alt="DIMANCHE"
              className="ml-4 h-72 w-72 lg:h-[30rem] lg:w-[30rem]"
            />
          </div>
          <div className="flex h-full w-full justify-center items-center">
            <h1 className="text-[1.90rem] font-semibold text-[#FFFFFF]" style={{ textShadow: '2px 2px 6px black' }}>
              L’application parfaite pour organiser vos matchs entre amis !
            </h1>
          </div>
        </div>
        <button className="border-solid border-[6px] border-[#FFFFFF] rounded-full p-4 w-80 h-28 text-3xl text-[#FFFFFF] font-semibold transition ease-in delay-50 hover:bg-[#04100D] hover:border-[#04100D]">
          CREER VOTRE MATCH
        </button>
      </div>
    </section>
  );
}

export default index
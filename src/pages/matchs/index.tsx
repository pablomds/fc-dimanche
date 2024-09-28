import matchCreationBackgroundSvg from '../../assets/matchs/BackgroundMatchCreation.svg';
import heroMatchCreationBackgroundMobileSvg from '../../assets/matchs/HeroMatchCreationMobile.svg';
import FcMobileSvg from '../../assets/matchs/FcMobile.svg'
import { useForm, Controller } from 'react-hook-form';
import { object, string, number, date, InferType } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale'; 
import { setHours, setMinutes } from 'date-fns';
import { createMatch } from '../../controllers/matchControllers';
import { utils } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';

const index = () => {

  const navigate = useNavigate();

  let matchCreation = object({
    numberOfPlayers: number()
      .typeError("Le nombre de joueurs doit être une valeur.")
      .required("Veuillez rentrer un nombre de joueurs.")
      .positive("Une valeur supérieur à 0 est requise."),
    matchLocation: string().required("Le lieu du match est requis."),
    matchDateTime: date().required("La date et l'heure sont requis."),
    organizerName: string().required("Un nom est requis."),
    organizerEmail: string()
      .required("Un mail est requis.")
      .email("L'email doit être valide"),
  });

  const today = new Date();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: yupResolver(matchCreation),
    defaultValues: {
      matchDateTime: today, // Set default value to today
    },
  });



  type Match = InferType<typeof matchCreation>;

  const onSubmit = async (data: any) => {

    let objDb = {
      number_of_players: data.numberOfPlayers,
      match_location: data.matchLocation,
      match_datetime: utils.getUnixTimeStamp(data.matchDateTime),
      organizer_name: data.organizerName,
      organizer_email: data.organizerEmail,
      is_confirmed: false
    }; 

    return new Promise<void>(() => {
      setTimeout(() => {
        navigate('/match/confirmation')
      }, 3000);
    });

    

    // try {

    //   await createMatch(objDb)

    // } catch (error) {
    //   console.log('error : ', error)
    // }

  };

  return (
    <section className="lg:bg-cover lg:bg-center lg:bg-img-match-creation h-screen w-screen overflow-y-hidden">
      <div className="w-full h-full flex flex-col items-center lg:justify-center justify-start">
        <div className="lg:hidden w-full flex justify-center relative sm:max-h-[303px]">
          <img
            src={heroMatchCreationBackgroundMobileSvg}
            className="w-full object-cover"
            alt="hero match creation"
          />
          <img
            src={FcMobileSvg}
            className="h-[100px] absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 "
            alt="FC svg"
          />
        </div>
        <div className="lg:min-w-[555px] lg:w-1/4 lg:h-3/4 lg:h-min-[808px] lg:bg-[#FFFFFF]  shadow-xl rounded-lg lg:overflow-y-auto lg:mt-0 bg-img-match-creation-mobile bg-no-repeat bg-cover mt-6 animate-apparitionFormMatchCreation">
          <form
            className="flex flex-col px-6 py-4 text-left w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex lg:justify-center mt-8 lg:mt-20 lg:mb-16">
              <h1 className="lg:text-4xl text-2xl font-semibold">Créez votre match</h1>
            </div>

            <div className="lg:mt-0 mt-8 flex flex-col group">
              <label
                htmlFor="numberOfPlayers"
                className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
              >
                NOMBRE DE JOUEURS :
              </label>
              <input
                type="text"
                {...register("numberOfPlayers")}
                className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out focus:drop-shadow-lg"
              />
              <span
                className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                  errors.numberOfPlayers ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.numberOfPlayers
                  ? errors.numberOfPlayers.message
                  : "Champs requis"}
              </span>
            </div>

            <div className="mt-4 flex flex-col group">
              <label
                htmlFor="matchLocation"
                className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
              >
                LIEU DU MATCH :
              </label>
              <input
                type="text"
                {...register("matchLocation")}
                className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
              />
              <span
                className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                  errors.matchLocation ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.matchLocation
                  ? errors.matchLocation.message
                  : "Champs requis"}
              </span>
            </div>

            <div className="mt-4 flex flex-col group">
              <label
                htmlFor="dateAndTimeOfMatch"
                className="text-[#827C7C] bg-transparent text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
              >
                DATE ET HEURE DU MATCH :
              </label>
              <Controller
                control={control}
                name="matchDateTime"
                render={({ field }) => {
                  const selectedDate = field.value || today; // Use today if no date is selected

                  return (
                    <DatePicker
                      className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none transition-all duration-300 ease-in-out focus:drop-shadow-lg w-full"
                      onChange={(date) => field.onChange(date)}
                      locale={fr}
                      selected={field.value || today}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Heure"
                      minDate={today} // Prevent selecting past dates
                      minTime={
                        // Restrict time to current time or later if today is selected (or if no date is selected yet)
                        selectedDate.toDateString() === today.toDateString()
                          ? setHours(
                              setMinutes(new Date(), currentMinute),
                              currentHour
                            )
                          : setHours(setMinutes(new Date(), 0), 0) // Allow all times for future dates
                      }
                      maxTime={setHours(setMinutes(new Date(), 45), 23)} // Latest allowed time is 23:45
                      dateFormat="dd/MM/yyyy HH:mm" // Format the displayed value in the picker
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  );
                }}
              />
              <span
                className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                  errors.matchDateTime ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.matchDateTime
                  ? errors.matchDateTime.message
                  : "Champs requis"}
              </span>
            </div>

            <div className="mt-4 flex flex-col group">
              <label
                htmlFor="organizerName"
                className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
              >
                NOM DE L'ORGANISATEUR :
              </label>
              <input
                type="text"
                {...register("organizerName")}
                className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
              />
              <span
                className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                  errors.organizerName ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.organizerName
                  ? errors.organizerName.message
                  : "Champs requis"}
              </span>
            </div>

            <div className="mt-4 flex flex-col group">
              <label
                htmlFor="organizerEmail"
                className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
              >
                MAIL DE L'ORGANISATEUR :
              </label>
              <input
                type="email"
                {...register("organizerEmail")}
                className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
              />
              <span
                className={`"flex items-center font-medium text-red-500 text-xs mt-1" ${
                  errors.organizerEmail?.message ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.organizerEmail
                  ? errors.organizerEmail.message
                  : "Champ requis"}
              </span>
            </div>

            <div className="my-8 lg:my-14 flex justify-center">
              <button
                type="submit"
                className="drop-shadow-2xl rounded-full p-4 w-72 h-20 text-xl text-[#FFFFFF] bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
              >
                {isSubmitting ? (
                  <div className="flex space-x-2 justify-center items-center">
                    <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-4 w-4 bg-white rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  "CRÉER LE MATCH"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default index
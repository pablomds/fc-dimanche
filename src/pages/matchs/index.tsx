import heroMatchCreationBackgroundMobileSvg from '../../assets/matchs/HeroMatchCreationMobile.svg';
import FcMobileSvg from '../../assets/matchs/FcMobile.svg'
import { useForm, Controller } from 'react-hook-form';
import { object, string, number, date } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createMatch } from '../../controllers/matchControllers';
import { utils } from '../../utils/utils';
// import { useNavigate } from 'react-router-dom';
import { sendEmailConfirmation } from '../../controllers/matchControllers';
import { setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale";
import { Match } from '../../models/Match';

const index = () => {

  // const navigate = useNavigate();

  let matchCreationSchema = object({
    numberOfPlayers: number()
      .typeError("Le nombre de joueurs doit être une valeur.")
      .required("Veuillez rentrer un nombre de joueurs.")
      .min(2, "Vous devez être minimun deux pour le match.")
      .max(100, "Vous pouvez être maximun 100.")
      .positive("Une valeur supérieur à 0 est requise."),
    eventLocation: string()
      .required("Le lieu du match est requis.")
      .min(1, "L'adresse doit contenir au moins 1 caractère.")
      .max(50, "L'adresse doit contenir moins de 50 caractères.")
      .transform(value => value.trim()),
    eventDateTime: date()
      .required("La date et l'heure sont requis.")
      .test("is-future-date", "La date doit être dans le futur.", (value) => {
        return value ? value > new Date() : false; // Check if the date is in the future
      }),
    name: string().required("Un nom est requis.").min(1, "Le nom doit contenir au moins 1 caractère.").max(50, "Le nom doit contenir moins de 50 caractères").transform(value => value.trim()),
    email: string()
      .required("Un mail est requis.")
      .email("L'email doit être valide")
      .min(3, "L'adresse email doit contenir au moins 3 caractères.")
      .max(254, "L'adresse email ne peut pas dépasser 254 caractères."),
  });

  const today = new Date();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  const roundUpToNext15 = (date: Date) => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 15) * 15;
    // If rounded minutes equals 60, we reset it to 0 and increment the hour
    return roundedMinutes === 60 
        ? setHours(setMinutes(date, 0), date.getHours() + 1) 
        : setMinutes(setHours(date, date.getHours()), roundedMinutes);
};

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: yupResolver(matchCreationSchema),
    defaultValues: {
      eventDateTime: roundUpToNext15(new Date()),
    },
  });

  // type Match = InferType<typeof matchCreationSchema>;

  const onSubmit = async (data: any) => {

    let newMatch = new Match(data);
    const eventDateTime = data.eventDateTime;

    let year = eventDateTime.getFullYear() % 100; 
    let month = eventDateTime.getMonth() + 1; 
    let day = eventDateTime.getDate();

    let hours = eventDateTime.getHours(); 
    let minutes = eventDateTime.getMinutes();


    try {

      newMatch.id = await createMatch(newMatch.toDb());

      if (!newMatch.id) return;

      const email = newMatch.email;
      const name = newMatch.name;
      const matchLocation = newMatch.eventLocation;
      const matchTime = `${hours < 10 ? '0' + hours : hours }:${minutes < 10 ? '0' + minutes : minutes}` ;
      const matchDate = `${day < 10 ? '0' + day : day }/${month}/${year}`;
      const confirmationLink = `${import.meta.env.VITE_BASE_URL}/match/confirmation?${newMatch.id}`;

      const response = await sendEmailConfirmation({
        email,
        matchLocation,
        name,
        matchTime,
        matchDate,
        confirmationLink,
      });

      if (import.meta.env.VITE_ENV === 'dev') {
        if (response.success) {
          console.log("Email sent successfully");
        } else {
          console.log("Failed to send email:", response.message);
        }
      }

    } catch (error) {
      if (import.meta.env.VITE_ENV === 'dev') console.log("Something went wrong:", error);
    }
  };

  return (
    <section className="lg:bg-cover lg:bg-center lg:bg-img-match-creation h-screen w-screen">
      <div className="w-full h-full flex flex-col items-center lg:justify-center justify-start md:overflow-y-hidden custom-scroll">
        <div className="lg:hidden w-full flex justify-center relative sm:max-h-[303px]">
          <img
            src={heroMatchCreationBackgroundMobileSvg}
            className="w-full object-cover"
            alt="hero match creation"
          />
          <img
            src={FcMobileSvg}
            className="h-[100px] absolute bottom-[-40px] left-1/2 transform -translate-x-1/2"
            alt="FC svg"
          />
        </div>
        <div className="lg:min-w-[555px] lg:w-1/4 lg:h-4/5 xl:h-3/4 lg:h-min-[808px] lg:bg-[#FFFFFF] shadow-xl rounded-lg lg:overflow-y-auto custom-scroll lg:mt-0 mt-6 bg-img-match-creation-mobile bg-no-repeat bg-cover  animate-apparitionFormMatchCreation">
          <form
            className="flex flex-col px-6 py-4 text-left w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex lg:justify-center mt-8 lg:mt-14 lg:mb-14">
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
                type="number"
                {...register("numberOfPlayers")}
                className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out focus:drop-shadow-lg"
                pattern="[0-9]*" 
                inputMode="numeric" 
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
                htmlFor="eventLocation"
                className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
              >
                LIEU DU MATCH :
              </label>
              <input
                type="text"
                {...register("eventLocation")}
                maxLength={50}
                className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
              />
              <span
                className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                  errors.eventLocation ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.eventLocation
                  ? errors.eventLocation.message
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
                name="eventDateTime"
                render={({ field }) => {

                  const selectedDate = field.value ? field.value : new Date();
                
                  return (
                    <DatePicker
                      className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none transition-all duration-300 ease-in-out focus:drop-shadow-lg w-full"
                      onChange={(date) => field.onChange(date)}
                      locale={fr}
                      selected={selectedDate}
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
                  errors.eventDateTime ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.eventDateTime
                  ? errors.eventDateTime.message
                  : "Champs requis"}
              </span>
            </div>

            <div className="mt-4 flex flex-col group">
              <label
                htmlFor="name"
                className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
              >
                NOM DE L'ORGANISATEUR :
              </label>
              <input
                type="text"
                {...register("name")}
                className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
              />
              <span
                className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                  errors.name ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.name
                  ? errors.name.message
                  : "Champs requis"}
              </span>
            </div>

            <div className="mt-4 flex flex-col group">
              <label
                htmlFor="email"
                className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
              >
                MAIL DE L'ORGANISATEUR :
              </label>
              <input
                type="email"
                {...register("email")}
                className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out  focus:drop-shadow-lg"
              />
              <span
                className={`"flex items-center font-medium text-red-500 text-xs mt-1" ${
                  errors.email?.message ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors.email
                  ? errors.email.message
                  : "Champ requis"}
              </span>
            </div>

            <div className="my-8 lg:my-5 flex justify-center">
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
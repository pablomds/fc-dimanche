import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getMatch, updateMatch } from '../../controllers/matchControllers';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { utils } from '../../utils/utils';
import { Match, WILL_BE_PRESENT } from '../../models/Match';
import { AiFillCloseCircle } from "react-icons/ai";
import _ from 'lodash';
import { MdError } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import { MdEventBusy } from "react-icons/md";




const invitation: React.FC = () => {

  const [isMatchNotFound, setIsMatchNotFound] = useState<boolean>(false);
  const [isEventDatePassed, setIsEventDatePassed] = useState<boolean>(false);
  const [willBePresentPlayersArray, setWillBePresentPlayersArray] = useState<any[]>([]);
  const [isMaxCapacity, setIsMaxCapacity] = useState<boolean>(false);
  const [isUserAddedSuccessfully , setIsUserAddedSuccessfully] = useState<boolean>()
  const [match, setMatch] = useState<Match>();

  let invitedPlayersSchema = object({
    willBePresent: string().required("Veuillez indiquez votre présence."),
    name: string()
      .required("Un nom est requis.")
      .min(1, "Le nom doit contenir au moins 1 caractère.")
      .max(50, "Le nom doit contenir moins de 40 caractères")
      .transform((value) => value.trim()),
    email: string()
      .email("L'email doit être valide.")
      .notRequired() 
      .max(254, "L'adresse email ne peut pas dépasser 254 caractères.")
      .nullable(),
  });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: yupResolver(invitedPlayersSchema),
        defaultValues: {
          willBePresent: WILL_BE_PRESENT.YES,
          email: '', // Initialize email as an empty string
        },
      });

      const onSubmit = async (data: any) => {

        let newInvitedPlayer = {
          willBePresent: data.willBePresent,
          name: data.name,
          email: data.email || "",
          createdAt: utils.getUnixTimeStamp(new Date()),
          updatedAt:  utils.getUnixTimeStamp(new Date()),
        };

        try {
          if (!match) return
          const currentMatch = await getMatch(match?.id);
          
          if (willBePresentPlayersArray.length + 1 > currentMatch.numberOfPlayers) {
            setIsMaxCapacity(true);
            return;
          }
          let updatedMatch = _.cloneDeep(match)
          updatedMatch?.invitedPlayers.push(newInvitedPlayer);
          if (!updatedMatch || !match.id) return
          await updateMatch(match.id, updatedMatch)
          setIsUserAddedSuccessfully(true);
        } catch (error) {
          if (import.meta.env.VITE_ENV === 'dev') console.log("Something went wrong:", error);
        }

      };

      useEffect(() => {
        const fetchData = async () => {

          const currentTimestamp = utils.getUnixTimeStamp(new Date());
          const searchParams = location.search;
          const matchID = searchParams.startsWith('?') ? searchParams.slice(1) : searchParams;

          const currentMatch = await getMatch(matchID);

          if (!currentMatch.id) {
            setIsMatchNotFound(true);
            return;
          };

          const filteredInvitedPlayers = _.filter(currentMatch.invitedPlayers, invitedPlayer => { if (invitedPlayer.willBePresent !== WILL_BE_PRESENT.NO) return invitedPlayer});

          if (filteredInvitedPlayers.length === currentMatch.numberOfPlayers) {
            setIsMaxCapacity(true);
            return;
          }

          setWillBePresentPlayersArray(filteredInvitedPlayers);

          if (currentTimestamp > currentMatch.eventDateTime) {
            setIsEventDatePassed(true);
            return;
          }

          setMatch(currentMatch);

        }

        fetchData()
      }, []);

  return (
    <section className="bg-cover bg-center lg:bg-img-match-creation bg-img-match-confirmation-mobile h-screen w-screen overflow-y-auto custom-scroll">
      <div className="flex justify-center items-center h-screen w-screen">
        <div className="w-3/4 h-[540px] md:w-1/2 md:h-3/5 lg:w-1/2 lg:max-w-[555px] bg-[#FFFFFF] rounded-lg shadow-xl px-2 transition ease-in duration-300">
          {(isMaxCapacity ||
            isMatchNotFound ||
            isUserAddedSuccessfully ||
            isEventDatePassed) && (
            <div className="flex flex-col items-center justify-center h-full space-y-5">
              {isMaxCapacity && (
                <AiFillCloseCircle className="text-red-500 h-40 w-40" />
              )}
              {isMatchNotFound && (
                <MdError className="text-red-500 h-40 w-40" />
              )}
              {isEventDatePassed && (
                <MdEventBusy className="text-red-500 h-40 w-40" />
              )}
              {isUserAddedSuccessfully && (
                <FaCheckCircle className="text-green-500 h-40 w-40" />
              )}
              <h1 className="font-semibold text-lg text-center">
                {isMaxCapacity && "⚠️ ENREGISTREMENT TERMINÉ"}
                {isMatchNotFound && "🔍 MATCH NON TROUVÉ"}
                {isUserAddedSuccessfully && "✅ ENREGISTREMENT RÉUSSI"}
                {isEventDatePassed && "⚽ MATCH TERMINÉ"}
              </h1>
              <p className="text-sm px-2 text-center">
                {isMaxCapacity &&
                  "Malheureusement, vous ne pouvez plus vous inscrire à ce match car il est déjà complet."}
                {isMatchNotFound &&
                  "Désolé, nous n'avons pas pu trouver ce que vous recherchez."}
                {isUserAddedSuccessfully &&
                  "Vous êtes inscrit avec succès au match. Bonne chance !"}
                {isEventDatePassed &&
                  "Ce match de football est déjà passé. Cependant, vous pouvez toujours créer un nouveau match."}
              </p>
              {(isMaxCapacity || isMatchNotFound || isEventDatePassed) && (
                <Link
                  to="/match/creation"
                  className="flex justify-center drop-shadow-2xl rounded-full p-4 w-60 h-14 text-base text-[#FFFFFF] bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                >
                  Créer un match
                </Link>
              )}
            </div>
          )}
          {match && !isUserAddedSuccessfully && !isMaxCapacity && (
            <div className="sm:space-y-4 md:space-y-8 lg:space-y-14">
              <div className="mt-4">
                <h1 className="sm:text-2xl lg:text-3xl font-semibold text-center my-2 ">
                  Invitation à un foot!
                </h1>
                <div className="sm:text-sm lg:text-base">
                  <p>
                    Vous avez été invité par{" "}
                    <span className="font-semibold break-words">
                      {match.name}
                    </span>
                    , pour un foot :
                  </p>
                </div>
                <div className="ml-2 mt-2">
                  <div className="sm:text-sm lg:text-base font-semibold">
                    Date :{" "}
                    {utils.formatUnixTimeStampToDDMMYY(match.eventDateTime)} à{" "}
                    {utils.formatUnixTimeStampToHours(match.eventDateTime)}
                  </div>
                  <div className="sm:text-sm lg:text-base font-semibold">
                    Lieu : {match.eventLocation}
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <form
                    className="flex flex-col text-left w-full"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="mt-4 lg:mt-0 flex flex-col group">
                      <label className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]">
                        SERAS TU PRESENT ?
                      </label>
                      <div className="relative">
                        <select
                          {...register("willBePresent")}
                          className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out focus:drop-shadow-lg w-full"
                        >
                          <option value={WILL_BE_PRESENT.YES}>
                            ✅ Oui, je serai là
                          </option>
                          <option value={WILL_BE_PRESENT.MAYBE}>
                            🤔 Peut-être...
                          </option>
                          <option value={WILL_BE_PRESENT.NO}>
                            ❌ Non, je ne peux pas, j'ai piscine! 🏊‍♂️
                          </option>
                        </select>
                      </div>
                      <span
                        className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                          errors.willBePresent ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {errors.willBePresent
                          ? errors.willBePresent.message
                          : "Champs requis"}
                      </span>
                    </div>
                    <div className="mt-4 lg:mt-0  flex flex-col group">
                      <label
                        htmlFor="name"
                        className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
                      >
                        NOM :
                      </label>
                      <input
                        type="name"
                        {...register("name")}
                        className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out focus:drop-shadow-lg"
                        max="50"
                        min="1"
                      />
                      <span
                        className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                          errors.name ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {errors.name ? errors.name.message : "Champs requis"}
                      </span>
                    </div>
                    <div className="mt-4 lg:mt-0  flex flex-col group">
                      <label
                        htmlFor="name"
                        className="text-[#827C7C] text-sm font-medium transition-all duration-300 ease-in-out group-focus-within:text-[#04100D]"
                      >
                        EMAIL (optionnel) :
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="border-b-2 solid border-[#827C7C] bg-transparent font-medium outline-none  transition-all duration-300 ease-in-out focus:drop-shadow-lg"
                        max="50"
                        min="1"
                      />
                      <span
                        className={`"flex items-center font-medium text-red-500 text-xs mt-1 transition duration-150 ease-in-out" ${
                          errors.email ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {errors.email ? errors.email.message : 'Saisir champs'}
                      </span>
                    </div>
                    <div className="my-8 lg:my-5 flex justify-center">
                      <button
                        type="submit"
                        className="drop-shadow-2xl rounded-full p-4 w-60 h-14 text-base text-[#FFFFFF] bg-gradient-to-r from-[#3B7214] via-[#5B8E2A] to-[#7AAB40] font-semibold transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"
                      >
                        {isSubmitting ? (
                          <div className="flex space-x-2 justify-center items-center">
                            <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-4 w-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-4 w-4 bg-white rounded-full animate-bounce"></div>
                          </div>
                        ) : (
                          "ENVOYER"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default invitation;
import { addDocumentToCollection, getDataFromCollection, deleteDocumentFromCollection, updateDocumentToCollection  } from "../database/functions";
import { COLLECTION } from "../database/collection";
// import { utils } from "../utils/utils";
import { functions } from '../database/firebase';
import { httpsCallable } from 'firebase/functions';
import _ from "lodash";
import { Match } from "../models/Match";

type EmailConfirmationResponse = {
  success: boolean;
  message?: string;
};

export const getMatch = async(matchId: string):Promise<Match> => {
  const match = await getDataFromCollection(COLLECTION.MATCHES, matchId);
  return Match.fromDb(match);
};

export const createMatch = async (match: any): Promise<string> => (await addDocumentToCollection(COLLECTION.MATCHES, match));

export const updateMatch = async (matchId: string, match: Match): Promise<void> => (await updateDocumentToCollection(COLLECTION.MATCHES, matchId, match.toDb()));

export const deleteMatch = async (matchId: string): Promise<void> => (await deleteDocumentFromCollection(COLLECTION.MATCHES, matchId));

export const sendEmailConfirmation = async ({
  email,
  matchLocation,
  name,
  matchTime,
  matchDate,
  confirmationLink,
}: {
  email: string;
  matchLocation: string;
  name: string;
  matchTime: string;
  matchDate: string;
  confirmationLink: string;
}):Promise<EmailConfirmationResponse> => {
  const sendAppointmentConfirmation = httpsCallable(
    functions,
    "sendAppointmentConfirmation"
  );

  try {
    const response = await sendAppointmentConfirmation({
      email,
      matchLocation,
      name,
      matchTime,
      matchDate,
      confirmationLink,
    });

    return response.data as EmailConfirmationResponse;
    
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};
import { addDocumentToCollection, deleteDocumentFromCollection  } from "../database/functions";
import { COLLECTION } from "../database/collection";
// import { utils } from "../utils/utils";
import { functions } from '../database/firebase';
import { httpsCallable } from 'firebase/functions';
import _ from "lodash";

export const createMatch = async (match: any): Promise<string> => (await addDocumentToCollection(COLLECTION.MATCHS, match));

type EmailConfirmationResponse = {
    success: boolean;
    message?: string;
  };

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
  
export const deleteMatch = async (matchId: string): Promise<void> => (await deleteDocumentFromCollection(COLLECTION.MATCHS, matchId))
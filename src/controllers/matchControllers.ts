import { addDocumentToCollection, getDataFromCollection, deleteDocumentFromCollection, updateDocumentToCollection, getAllDataFromCollectionWithWhereArray  } from "../database/functions";
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

export const getMatch = async(matchId: string):Promise<Match | null> => {
  const match = await getDataFromCollection(COLLECTION.MATCHES, matchId);
  if(match) return Match.fromDb(match);
  return null;
};

export const getMatchWithEmailAndKeyAccess = async (
  matchEmail: string,
  accessKey: string
): Promise<Match | null> => {
  const whereArray = { property: "access_key", propertyValue: accessKey };
  const allMatchesFromDb = await getAllDataFromCollectionWithWhereArray(
    COLLECTION.MATCHES,
    whereArray
  );

  if (allMatchesFromDb.length) {
    const matches = _.map(allMatchesFromDb, (match) => Match.fromDb(match));
    const foundMatch = _.find(matches, {
      email: matchEmail,
      accessKey: accessKey,
    });
    return foundMatch ? foundMatch : null;
  }
  return null;
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

export const sendEmailCalendarInvitation = async ({
  organizerEmail,
  organizerName,
  attendeeName,
  attendeeEmail,
  matchDate,
  matchDateUnixTimeStamp,
  matchTime,
  matchLocation,
}: {
  organizerEmail: string;
  organizerName: string;
  attendeeName: string;
  attendeeEmail: string;
  matchDate: string;
  matchDateUnixTimeStamp: number;
  matchTime: string;
  matchLocation: string;
}): Promise<EmailConfirmationResponse> => {
  const sendInvitationToCalendar = httpsCallable(
    functions,
    "sendInvitationToCalendar"
  );

  try {
    const response = await sendInvitationToCalendar({
      organizerEmail,
      organizerName,
      attendeeName,
      attendeeEmail,
      matchLocation,
      matchTime,
      matchDate,
      matchDateUnixTimeStamp,
    });

    return response.data as EmailConfirmationResponse;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

export const sendEmailPreviewMatchLink = async ({
  email, 
  previewMatchLink, 
  name,
} : {
  email: string,
  previewMatchLink: string,
  name: string
}):Promise<EmailConfirmationResponse> => {

  const sendPreviewMatchLink = httpsCallable(functions, "sendLinkToPreviewMatch");
  try {
    const response = await sendPreviewMatchLink({
      email,
      name,
      previewMatchLink
    });

    return response.data as EmailConfirmationResponse;

  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
}
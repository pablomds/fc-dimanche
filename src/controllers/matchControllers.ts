import { addDocumentToCollection, deleteDocumentFromCollection, updateDocumentToCollection  } from "../database/functions";
import { COLLECTION } from "../database/collection";
import { utils } from "../utils/utils";
import _ from "lodash";

export const createMatch = async (match: any): Promise<string> => (await addDocumentToCollection(COLLECTION.MATCHS, match));

export const deleteMatch = async (matchId: string): Promise<void> => (await deleteDocumentFromCollection(COLLECTION.MATCHS, matchId))
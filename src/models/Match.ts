import { utils } from "../utils/utils";
import { Database } from "./Database";
import _ from "lodash";

export enum WILL_BE_PRESENT {
    YES = 'yes',
    NO = 'no',
    MAYBE = 'maybe'
}

export type invitedPlayer = {
  willBePresent: WILL_BE_PRESENT;
  name: string;
  email: string;
  createdAt: number;
  updatedAt: number;
};

export class Match extends Database {

    public numberOfPlayers: number;
    public eventLocation: string;
    public eventDateTime: number; 
    public name: string;
    public email: string;
    public isConfirmed: boolean;
    public invitedPlayers: invitedPlayer[] = []
    public accessKey: string = "";

    constructor(data?: {
        numberOfPlayers?: number;
        eventLocation?: string;
        eventDateTime?: Date; 
        name?: string;
        email?: string;
        accessKey?: string;
    }) {
        super();
        this.numberOfPlayers = data?.numberOfPlayers ?? 1;
        this.eventLocation = data?.eventLocation ?? "Unknown location";
        this.eventDateTime = data?.eventDateTime ? utils.getUnixTimeStamp(data?.eventDateTime) : utils.getUnixTimeStamp(new Date()) ;
        this.name = data?.name ?? "Unknown";
        this.email = data?.email ?? "Anonymous";
        this.isConfirmed = false; 
        this.accessKey = data?.accessKey ?? "";
    }

    toDb(): any {
        return {
            number_of_players: this.numberOfPlayers,
            event_location: this.eventLocation,
            event_datetime: this.eventDateTime,
            name: this.name,
            email: this.email,
            is_confirmed: this.isConfirmed,
            created_date: this.createdDate,
            updated_date: this.updatedDate,
            is_active: this.isActive,
            access_key: this.accessKey,
            invited_players: this.invitedPlayers.length ?  _.map(this.invitedPlayers, invitedPlayer => (
                {
                    will_be_present: invitedPlayer.willBePresent,
                    name: invitedPlayer.name,
                    email: invitedPlayer.email  !== "" ? invitedPlayer.email : "" ,
                    created_at: invitedPlayer.createdAt,
                    updated_at: invitedPlayer.updatedAt
                }
            )) : []
        };
    }

    static fromDb(objDb: any): Match {

        let matchObj = {
            numberOfPlayers: objDb.number_of_players,
            eventLocation: objDb.event_location,
            eventDateTime: utils.formatUnixTimeStampToDate(objDb.event_datetime),
            name: objDb.name, 
            email: objDb.email, 
            isConfirmed: objDb.is_confirmed,
            accessKey: objDb.access_key
        };

        let match = new Match(matchObj);

        match.id = objDb.id;
        match.createdDate = objDb.created_date;
        match.updatedDate = objDb.updated_date;
        match.isActive = objDb.is_active;
        match.accessKey = objDb.access_key;
        if (objDb.invited_players && objDb.invited_players.length) {
            match.invitedPlayers = _.map(objDb.invited_players, invited_player  => ({
                willBePresent: invited_player.will_be_present,
                name: invited_player.name,
                email: invited_player.email || "",
                createdAt: invited_player.created_at,
                updatedAt: invited_player.updated_at,
            }))
        }
        return match;
    };

};
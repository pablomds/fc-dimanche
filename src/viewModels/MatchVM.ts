import { Match, WILL_BE_PRESENT } from "../models/Match";
import { utils } from "../utils/utils";

export class MatchVM extends Match {

    constructor() { super(); }

    static fromMatch(match: Match): MatchVM {

        let matchVM = new MatchVM(); 
        matchVM.accessKey = match.id;
        matchVM.createdDate = match.createdDate;
        matchVM.email = match.email;
        matchVM.eventDateTime = match.eventDateTime;
        matchVM.eventLocation = match.eventLocation;
        matchVM.id = match.id;
        matchVM.invitedPlayers = match.invitedPlayers;
        matchVM.isActive = match.isActive;
        matchVM.isConfirmed = match.isConfirmed;
        matchVM.name = match.name;
        matchVM.numberOfPlayers = match.numberOfPlayers;
        return matchVM
    }

    toMatch():Match {
        let match = new Match({
            accessKey: this.accessKey,
            email: this.email,
            eventLocation: this.eventLocation,
            eventDateTime:  utils.formatUnixTimeStampToDate(this.eventDateTime),
            name: this.name,
        });
        match.createdDate = this.createdDate;
        match.id = this.id;
        match.invitedPlayers = this.invitedPlayers;
        match.isActive = this.isActive;
        match.isConfirmed = this.isConfirmed;
        match.name = this.name;
        match.numberOfPlayers = this.numberOfPlayers;
        return match
    };

    getEventDateTimeAsString() {
        return utils.formatUnixTimeStampToDDMMYY(this.eventDateTime)
    }

    getEventHourAsString() {
        return utils.formatUnixTimeStampToHours(this.eventDateTime)
    }
    
    static getInvitedPlayerColor(invitedPlayerStatus: WILL_BE_PRESENT) {

        let tagBackgroundColor = '';
        let tagText = '';
        let tagTextColor = '';

        switch(invitedPlayerStatus) {
            case WILL_BE_PRESENT.MAYBE:
                tagBackgroundColor = 'bg-orange-200' 
                tagText = 'Peut-être'
                tagTextColor = 'text-orange-900'
                break;
            case WILL_BE_PRESENT.NO:
                tagBackgroundColor = 'bg-red-200'
                tagText = 'Absent'
                tagTextColor = 'text-red-900'
                break;
            case WILL_BE_PRESENT.YES:
                tagBackgroundColor = 'bg-green-200'
                tagText = 'Présent'
                tagTextColor = 'text-green-900'
                break;
        }

        return { tagBackgroundColor, tagText, tagTextColor };
        
    }
}
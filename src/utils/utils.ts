export class utils {
    static getUnixTimeStamp = (date: Date):number =>
        date.getTime()

    static formatUnixTimeStampToDate = (unixTimeStamp: number): Date =>
        new Date(unixTimeStamp)
}
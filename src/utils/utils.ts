export class utils {
  static getUnixTimeStamp = (date: Date): number => date.getTime();

  static formatUnixTimeStampToDate = (unixTimeStamp: number): Date =>
    new Date(unixTimeStamp);

  static isValidFirestoreId(id: string): boolean {
    if (id.length !== 20) return false;

    // Check if it only contains valid characters (alphanumeric, '-' and '_')
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    return validPattern.test(id);
  }

  static formatUnixTimeStampToHours(unixTimeStamp: number): string {
    const eventDateTimeAsDate = utils.formatUnixTimeStampToDate(unixTimeStamp);
    const hours = eventDateTimeAsDate.getHours();
    const minutes = eventDateTimeAsDate.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}h${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  }
  static formatUnixTimeStampToDDMMYY(unixTimeStamp: number): string {
    const eventDateTimeAsDate = utils.formatUnixTimeStampToDate(unixTimeStamp);
    let year = eventDateTimeAsDate.getFullYear() % 100; 
    let month = eventDateTimeAsDate.getMonth() + 1; 
    let day = eventDateTimeAsDate.getDate();
    return `${day < 10 ? '0' + day : day }/${month}/${year}`;
  }
}
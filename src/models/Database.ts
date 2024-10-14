import { utils } from "../utils/utils";

export class Database {
    
    public id: string = "";
    public isActive: boolean = true;
    public createdDate:number = utils.getUnixTimeStamp(new Date());
    public updatedDate: number = utils.getUnixTimeStamp(new Date());

    constructor(){};
    
}
import { StorageModel } from "./storageModel";

export class ShoppingCartResponseModel{
    constructor(public id: number | string,
        public storages: StorageModel[]){            
    }
}
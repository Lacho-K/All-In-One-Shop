import ShoppingCartStorage from "./shoppingCartStorage";
import { StorageModel } from "./storageModel";

export class ShoppingCartResponseModel{
    constructor(public id: number | string,
        public userId: number | string,
        public shoppingCartStorages: ShoppingCartStorage[]){            
    }
}
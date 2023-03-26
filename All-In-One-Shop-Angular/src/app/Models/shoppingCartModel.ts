import ShoppingCartStorage from "./shoppingCartStorage";
import { StorageModel } from "./storageModel";

export class ShoppingCartModel{
    constructor(public userId: number | string,
        public shoppingCartStorages: ShoppingCartStorage[]){            
    }
}
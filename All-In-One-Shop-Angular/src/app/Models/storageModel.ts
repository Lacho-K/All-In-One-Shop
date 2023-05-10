export class StorageModel{
    constructor(public productId : number | string,
        public productQuantity : number,
        public productLocation : string,
        public productRatings : string,
        public dateCreated: Date){       
    }
}
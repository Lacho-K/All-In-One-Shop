export class StorageResponseModel{
    constructor(public id : number | string,
        public productId : number | string,
        public productQuantity : number,
        public productLocation : string,
        public productRatings : string){       
    }
}
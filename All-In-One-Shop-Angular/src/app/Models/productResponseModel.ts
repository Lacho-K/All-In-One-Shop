export class ProductResponseModel{
    constructor(public id: number|string, 
        public name: string, 
        public description: string, 
        public productImageURL:string, 
        public productTypeId: string | number, 
        public price: number){        
    }
}
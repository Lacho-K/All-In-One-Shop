import { ProductTypeModel } from "./productTypeModel";

export class ProductModel{
    constructor(public name: string, 
        public description: string, 
        public productImageURL:string, 
        public productTypeId: string | number, 
        public productType: ProductTypeModel,
        public price: number){        
    }
}

export class ProductModel{
    constructor(public name: string, 
        public description: string, 
        public productImageURL:string, 
        public productTypeId: string | number, 
        public price: number){        
    }
}
export class UserModel{
    constructor(public firstName: string,
        public lastName: string,
        public username: string,
        public password: string,
        public token: string,
        public role: string,
        public email: string,
        public shoppingCartId: number|string){

    }
}
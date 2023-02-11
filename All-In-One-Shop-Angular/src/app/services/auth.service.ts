import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLoginModel } from '../models/userLoginModel';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly usersUrl = 'https://localhost:7220/api/users';

  constructor(private http: HttpClient) { }

    // Users

    register(data: UserModel){
      return this.http.post(this.usersUrl + '/register', data);
    }
  
    login(data: UserLoginModel){
      return this.http.post(this.usersUrl + '/authenticate', data);
    }

    // Auth

    storeToken(token: string){
      localStorage.setItem('token', token);
    }

    getToken(){
      localStorage.getItem('token');
    }

    isLoggedIn(): boolean{
      return !!localStorage.getItem('token');
    }
}

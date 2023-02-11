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

    // Auth

    register(data: UserModel){
      return this.http.post(this.usersUrl + '/register', data);
    }
  
    login(data: UserLoginModel){
      return this.http.post(this.usersUrl + '/authenticate', data);
    }


    storeToken(token: string){
      localStorage.setItem('token', token);
    }

    getToken(){
      return localStorage.getItem('token');
    }

    isLoggedIn(): boolean{
      return !!localStorage.getItem('token');
    }

    signOut(){
      localStorage.clear();
    }
}

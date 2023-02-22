import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserLoginModel } from '../models/userLoginModel';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly usersUrl = 'https://localhost:7220/api/users';
  private userPayload: any; 

  constructor(private http: HttpClient) { 
    this.userPayload = this.decodedToken();
  }

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
      // exclamation marks to make the return type boolean
      return !!localStorage.getItem('token');
    }

    isAdmin(): boolean{
      return this.getRoleFromToken() == 'Admin';
    }

    signOut(){
      localStorage.clear();
    }

    decodedToken(){
      const jwtHelper = new JwtHelperService();

      // exclamation mark to avoid "Object is possibly 'undefined" error
      const token = this.getToken()!;

      return jwtHelper.decodeToken(token)
    }

    getFullNameFromToken(){
      if(this.userPayload){
        return this.userPayload.name;
      }
    }

    getRoleFromToken(){
      if(this.userPayload){
        return this.userPayload.role;
      }
    }
}

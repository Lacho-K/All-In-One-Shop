import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor (private auth: AuthService){}

  canActivate():boolean{
    if(this.auth.isLoggedIn()){     
      return true;
    }
    else{
      return false;
    }
  }
    
  
}

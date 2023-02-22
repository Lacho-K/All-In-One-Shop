import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppComponent } from '../app.component';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router, private toaster: NgToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();
        

    if(token){
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      })
    }
    

    return next.handle(request).pipe(
      catchError((err: any) => {
        if(err instanceof HttpErrorResponse){
          console.log('correct instance');       
          if(err.status === 401){
            console.log('correct status');           
            this.auth.signOut();
            AppComponent.IsLoggedIn = this.auth.isLoggedIn();
            //Make this work
            //this.router.navigate(['/login'])
            this.toaster.warning({detail:'WARNING', summary: 'Please login to do that', duration: 3000});
          }
        }
        return throwError(() => new Error("Something went wrong"))
      })
    );
  }
}

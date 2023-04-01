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
          if(err.status === 401){
            this.auth.signOut();
            //close open modal so that you can navigate the new loaded page
            document.getElementById('add-edit-modal-close')?.click();
            
            this.router.navigate(['/login']);
            this.toaster.warning({detail:'WARNING', summary: 'Please login to do that', duration: 3000});       
          }
        }
        return throwError(() => new Error("Something went wrong"))
      })
    );
  }
}

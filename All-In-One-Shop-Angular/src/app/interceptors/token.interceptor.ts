import { Injectable, Input } from '@angular/core';
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
import ModalCloser from '../helpers/closeModals';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router, private toaster: NgToastService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();


    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    }


    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.auth.signOut();
            //close open modal so that you can navigate the new loaded page
            ModalCloser.closeOpenModals();
          
            //alert('Please login to do that.')

            localStorage.setItem("isOk", "true")

            this.router.navigate(['/login']).then(() => window.location.reload());
          
            // suppressing the error because it is already handled
            return new Observable<any>();
          }
          else if (err.status === 400) {
            this.toaster.error({ detail: 'WARNING', summary: `${err.error.message}`, duration: 3000 });
          }
        }
        return throwError(() => new Error("Something went wrong"))
      })
    );
  }
}

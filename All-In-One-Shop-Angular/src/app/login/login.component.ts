import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import AnimateForm from '../helpers/animateForm';
import ValidateForm from '../helpers/validateForm';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../services/user-store.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { ShowProductComponent } from '../product/show-product/show-product.component';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { throwError } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { StorageResponseModel } from '../models/storageResponseModel';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm !: FormGroup

  //variables for showing/hiding password
  showPass: boolean = false;
  inputType: string = 'password';
  eyeIcon: string = 'fa-eye-slash';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private userStore: UserStoreService, private toast: NgToastService, private http: HttpClient, private shoppingCart: ShoppingCartService, private loginService: LoginService, private toaster: NgToastService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    if(localStorage.getItem("isOk")){
      this.toaster.error({ detail: 'WARNING', summary: `Please login`, duration: 3000 });
      setTimeout(function (){
        localStorage.removeItem("isOk");
      }, 3000)
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.loginUser(this.loginForm.value);
    }
    else {
      ValidateForm.validateAllFormFields(this.loginForm)

      // Assign shake animation to all invalid inputs
      AnimateForm.assignAnimation('input.ng-invalid');
    }
  }

  showHidePass() {
    this.showPass = !this.showPass;
    this.showPass ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.showPass ? this.inputType = 'text' : this.inputType = 'password';
  }

}

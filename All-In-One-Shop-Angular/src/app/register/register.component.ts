import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AppComponent } from '../app.component';
import AnimateForm from '../helpers/animateForm';
import ValidateForm from '../helpers/validateForm';
import { ShoppingCartModel } from '../models/shoppingCartModel';
import { UserLoginModel } from '../models/userLoginModel';
import { UserModel } from '../models/userModel';
import { UserResponseModel } from '../models/userResponseModel';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../services/user-store.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm !: FormGroup
  userLogin : UserLoginModel = new UserLoginModel("", "");
  userRegister : UserModel = new UserModel("", "", "", "", "", "", "", new ShoppingCartModel(0, []));

  
  //variables for showing/hiding password
  showPass: boolean = false;
  showRePass: boolean = false;
  passInputType: string = 'password';
  rePassInputType: string = 'password';
  eyeIconPass: string = 'fa-eye-slash';
  eyeIconRePass: string = 'fa-eye-slash';
  
  constructor(private fb: FormBuilder, private auth: AuthService, private toast: NgToastService, private userStore: UserStoreService, private router: Router) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),
        this.regexValidator(new RegExp('[0-9]'), {digits : true}),
        this.regexValidator(new RegExp('[A-Z]'), {capitals : true}),
        this.regexValidator(new RegExp('[a-z]'), {lowerCase : true}), 
        this.regexValidator(new RegExp('[_@.\/#&+-]'), {specialCharacter: true})]],
      rePassword: ['', [Validators.required]]
    })
    
  }

  onSubmit(){
    this.onPasswordChange();    
    if(this.registerForm.valid){
      //register the user with the form info plus a new shoopping cart just for the user
      this.setUserObjInfo();      
      this.auth.register(this.userRegister)
      .subscribe({
        next: () => {

          //login automaticaly after registering
          this.userLogin = new UserLoginModel(this.registerForm.value.username, this.registerForm.value.password);
          this.auth.login(this.userLogin).subscribe((res: any) => {
            
            this.auth.storeToken(res.token);     
            const tokenPayload = this.auth.decodedToken();

            this.userStore.setFullNameForStore(tokenPayload.name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.userStore.setIdForStore(tokenPayload.userId);

            this.router.navigate(['/dashboard']);

            AppComponent.IsLoggedIn = this.auth.isLoggedIn();
            AppComponent.IsAdmin = this.auth.isAdmin();  

            this.toast.success({detail: "SUCCESS", summary: "logged in", duration: 3000})
          })         
        },
        error: (() => {
          this.toast.error({detail: 'ERROR', summary: 'Email or username already exists!', duration: 3000});
        })
      })
    }
    else{
      ValidateForm.validateAllFormFields(this.registerForm);
      
      AnimateForm.assignAnimation('input.ng-invalid, input.mismatch');
    }
  }

  onPasswordChange() {
    if (this.registerForm.get('rePassword')?.value == this.registerForm.get('password')?.value) {
      this.registerForm.setErrors(null);
    } else {
      this.registerForm.setErrors({ mismatch: true });
    }
  }

  setUserObjInfo(){
    this.userRegister.firstName = this.registerForm.value.firstName;
    this.userRegister.lastName = this.registerForm.value.lastName;
    this.userRegister.username = this.registerForm.value.username;
    this.userRegister.email = this.registerForm.value.email;
    this.userRegister.password = this.registerForm.value.password;
  }

  showHidePass(){
    this.showPass = !this.showPass;
    this.showPass ? this.eyeIconPass = 'fa-eye' : this.eyeIconPass = 'fa-eye-slash';
    this.showPass ? this.passInputType = 'text' : this.passInputType = 'password';
  }

  showHideRePass(){
    this.showRePass = !this.showRePass;
    this.showRePass ? this.eyeIconRePass = 'fa-eye' : this.eyeIconRePass = 'fa-eye-slash';
    this.showRePass ? this.rePassInputType = 'text' : this.rePassInputType = 'password';
  }

  regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      if (!control.value) {
        return null as any;
      }
      const valid = regex.test(control.value);
      return valid ? null as any : error;
    };
  }
}

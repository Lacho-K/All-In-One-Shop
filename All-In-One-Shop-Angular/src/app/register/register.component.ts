import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import AnimateForm from '../helpers/animateForm';
import ValidateForm from '../helpers/validateForm';
import { UserLoginModel } from '../models/userLoginModel';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../services/user-store.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm !: FormGroup
  userLogin !: UserLoginModel
  
  //variables for showing password
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
      this.auth.register(this.registerForm.value)
      .subscribe({
        next: (()=>{
          this.userLogin = new UserLoginModel(this.registerForm.value.username, this.registerForm.value.password);
          this.auth.login(this.userLogin).subscribe((res: any) => {
            this.auth.storeToken(res.token);     
            const tokenPayload = this.auth.decodedToken();
            this.userStore.setFullNameForStore(tokenPayload.name);
            this.userStore.setRoleForStore(tokenPayload.role);
            this.router.navigate(['/dashboard']);
            NavbarComponent.loggedIn = this.auth.isLoggedIn();
            this.toast.success({detail: "SUCCESS", summary: "logged in", duration: 3000})
          })         
        }),
        error: (() => {
          this.toast.error({detail: 'ERROR', summary: 'Email or username already exists!', duration: 3000});
        })
      })
    }
    else{
      ValidateForm.validateAllFormFields(this.registerForm)    

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

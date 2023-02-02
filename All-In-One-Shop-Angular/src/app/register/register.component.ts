import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import AnimateForm from '../helpers/animateForm';
import ValidateForm from '../helpers/validateForm';
import { ShopApiService } from '../shop-api.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm !: FormGroup
  
  //variables for showing password
  showPass: boolean = false;
  showRePass: boolean = false;
  passInputType: string = 'password';
  rePassInputType: string = 'password';
  eyeIconPass: string = 'fa-eye-slash';
  eyeIconRePass: string = 'fa-eye-slash';
  
  constructor(private fb: FormBuilder, private service: ShopApiService) { }

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
      this.service.register(this.registerForm.value)
      .subscribe({
        next: (()=>{
          alert("sign up sucessful");
          this.registerForm.reset();
        }),
        error: (err => {
          alert(err?.error.message);
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

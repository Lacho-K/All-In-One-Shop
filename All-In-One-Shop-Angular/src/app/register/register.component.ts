import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm !: FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rePassword: ['', Validators.required]
    })
    
  }

  onSubmit(){
    this.onPasswordChange();
    if(this.registerForm.valid){
      console.log(this.registerForm.value);
    }
    else{
      this.validateAllFormField(this.registerForm)
      
    }
  }

  private validateAllFormField(formGroup : FormGroup){
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf: true});
      }
      else if(control instanceof FormGroup){
        this.validateAllFormField(control);
      }
    })
  }

  onPasswordChange() {
    if (this.registerForm.get('rePassword')?.value == this.registerForm.get('password')?.value) {
      this.registerForm.setErrors(null);
    } else {
      this.registerForm.setErrors({ mismatch: true });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import AnimateForm from '../helpers/animateForm';
import ValidateForm from '../helpers/validateForm';


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
      ValidateForm.validateAllFormFields(this.registerForm)    

      AnimateForm.assignAnimation('input.ng-invalid');
    }
  }

  onPasswordChange() {
    if (this.registerForm.get('rePassword')?.value == this.registerForm.get('password')?.value) {
      this.registerForm.setErrors(null);
    } else {
      this.registerForm.setErrors({ mismatch: true });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import AnimateForm from '../helpers/animateForm';
import ValidateForm from '../helpers/validateForm';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm !: FormGroup

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value);
      
    }
    else{
      ValidateForm.validateAllFormFields(this.loginForm)
     
      // Assign shake animation to all invalid inputs
      AnimateForm.assignAnimation('input.ng-invalid');  
    }
  }

}

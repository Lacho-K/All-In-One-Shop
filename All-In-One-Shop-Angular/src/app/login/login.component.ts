import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import AnimateForm from '../helpers/animateForm';
import ValidateForm from '../helpers/validateForm';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  loginForm !: FormGroup

  //variables for showing password
  showPass: boolean = false;
  inputType: string = 'password';
  eyeIcon: string = 'fa-eye-slash';

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.auth.login(this.loginForm.value)
      .subscribe({
        next: ((res:any) => {
          alert("loged in");
          this.auth.storeToken(res.token);
          this.loginForm.reset();
        }),
        error: (() => {
          alert("Invalid password or username");
        })
      });
      
    }
    else{
      ValidateForm.validateAllFormFields(this.loginForm)
     
      // Assign shake animation to all invalid inputs
      AnimateForm.assignAnimation('input.ng-invalid');  
    }
  }

  showHidePass(){
    this.showPass = !this.showPass;
    this.showPass ? this.eyeIcon = 'fa-eye' : this.eyeIcon = 'fa-eye-slash';
    this.showPass ? this.inputType = 'text' : this.inputType = 'password';
  }

}

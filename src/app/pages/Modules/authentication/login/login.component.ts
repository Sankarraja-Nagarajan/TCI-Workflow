import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoginService } from '../../../Services/login.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class LoginComponent {

  hide = true;
  loginFormGroup : FormGroup;

  constructor(private _router : Router,
              private _fb : FormBuilder, 
              private _loginService : LoginService)
  {

    this.loginFormGroup = _fb.group({
      UserName : ['', Validators.required],
      Password : ['', Validators.required]
    })

  }


  // Login Method
  Login()
  {
    if(this.loginFormGroup.value.UserName == 'User' && this.loginFormGroup.value.Password == 'User@123' ||
       this.loginFormGroup.value.UserName == 'Approver1' && this.loginFormGroup.value.Password == 'Approver1@123'  ||
       this.loginFormGroup.value.UserName == 'Approver2' && this.loginFormGroup.value.Password == 'Approver2@123'  ||
       this.loginFormGroup.value.UserName == 'Approver3' && this.loginFormGroup.value.Password == 'Approver2@123'  )
    {
      this._loginService.getUserName(this.loginFormGroup.value.UserName);
      localStorage.setItem('UserName', this.loginFormGroup.value.UserName);
      this._router.navigate(['/pages/entry-pages/dashboard']);
    }
  }

}

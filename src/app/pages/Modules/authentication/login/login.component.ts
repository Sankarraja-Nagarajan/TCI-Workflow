import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoginService } from '../../../Services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonSpinnerService } from '../../../Services/common-spinner.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/notification-snackbar';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class LoginComponent {

  hide = true;
  loginFormGroup : FormGroup;
  expiryDate : number;
  userCredential : any;

  constructor(private _router : Router,
              private _fb : FormBuilder, 
              private _loginService : LoginService,
              private _dialog : MatDialog, 
              private _commonSpinner : CommonSpinnerService, 
              private _commonService : CommonService, )
  {

    this.loginFormGroup = _fb.group({
      UserId : ['', Validators.required],
      Password : ['', Validators.required]
    })

  }
  /* Constructor End */



  ngOnInit()
  {
    if(localStorage.getItem('TciToken'))
    {
      this.userCredential = this._loginService.decryptToken(localStorage.getItem('TciToken'));
      this._router.navigate(['pages/entry-pages/dashboard'])
    }
  }



  /* Login Method */
  Login()
  {
      if(this.loginFormGroup.valid)
      {
        this._commonSpinner.showSpinner();
        this._loginService.authentication(this.loginFormGroup.value).subscribe({
          next : (response) => 
          {
            this._loginService.getPasswordValidity(this.loginFormGroup.value.UserId).then(
              (data) => 
              {
                this.expiryDate = data;
  
                if(this.expiryDate < 90)
                {
                  if(response)
                  {
                    localStorage.setItem('TciToken', response.token);
                    this._loginService.getUserName(response.token);
                    this._commonSpinner.hideSpinner();
                    this._router.navigate(['/pages/entry-pages/dashboard']).then(() => 
                    {
                      this._commonService.openSnackbar(response.message, snackbarStatus.Success);
                      if(this.expiryDate >= 85)
                      {
                        setTimeout(() =>
                        {
                          this._commonService.openSnackbar(`Password change required within next ${90 - this.expiryDate} days`, snackbarStatus.Warning);
                        },2500)
                      }
                    });
                  }
                }
                else
                {
                  this._commonSpinner.hideSpinner();
                  this.loginFormGroup.reset();
                  this.OpenForgotPasswordDialog("Change Password");
                }
  
              }
            ).catch((err) => 
            {
              this._commonSpinner.hideSpinner();
              this._commonService.openSnackbar(err, snackbarStatus.Danger);
            })
          },error : (err) => {
            this._commonSpinner.hideSpinner();
            this._commonService.openSnackbar(err, snackbarStatus.Danger);
          },
        })
      }
      else
      {
        this._commonService.openSnackbar("Enter User Id, Password", snackbarStatus.Danger);
        this.loginFormGroup.markAllAsTouched();
      }
  }

  /* Open Forgot Password Dialog */
  OpenForgotPasswordDialog(choice : string){
    this.loginFormGroup.reset();
    const dialogRef = this._dialog.open(ForgotPasswordDialogComponent, {
      disableClose: true,
      backdropClass: 'userActivationDialog',
      data : choice,
    }).afterClosed()
    .subscribe((res) => {
      if(res == "Change Password")
      {
        this.OpenForgotPasswordDialog(res);
      }
      else if(res == "Forgot Password")
      {
        this.OpenForgotPasswordDialog(res);
      }
    });
  }

}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NbToastrService } from '@nebular/theme';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userName$ = new Subject();

  constructor(private _httpService : HttpService, 
              private toastrService: NbToastrService) { }

  getUserName(userName)
  {
    this.userName$.next(userName);
  }

  decryptToken(token)
  {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    return decodedToken;
  }

  showToast(message: string, color: string, position) {
    this.toastrService.show('',
      message,
      { duration: 3000, status: color, position, icon: '' });
  }

  isLogin()
  {
    return !!localStorage.getItem('TciToken');
  }

  getPasswordValidity(userId) : Promise<any>
  {
    return this._httpService.get(`Authentication/GetPasswordValidity?userId=${userId}`).toPromise();
  }

  authentication(authUser : any) : Observable<any>
  {
    const URL = 'Authentication/Authentication';
    return this._httpService.post(URL, authUser);
  }

  sendMailToGenerateOtp(userMail) : Observable<any>
  {
    const URL = 'Authentication/GenerateOtp';
    return this._httpService.post(URL, userMail);
  }

  confirmOtp(userId, otp) : Observable<any>
  {
    const URL = `Authentication/ConfirmOtp?userId=${userId}&otp=${otp}`;
    return this._httpService.get(URL);
  }

  changePassword(resetPassword) : Observable<any>
  {
    const URL = `Authentication/ForgotPassword`;
    return this._httpService.post(URL, resetPassword);
  }

}

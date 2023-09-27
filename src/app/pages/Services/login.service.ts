import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  userName$ = new Subject();

  constructor() { }

  getUserName(userName)
  {
    this.userName$.next(userName);
  }

}

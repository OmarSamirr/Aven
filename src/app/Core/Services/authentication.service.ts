import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly _HttpClient = inject(HttpClient);
  private readonly _Router = inject(Router);
  userData:any;

  createUser(newUserData:object):Observable<any>
  {
    return this._HttpClient.post(`${environment.baseURL}/api/v1/auth/signup`, newUserData)
  }
  checkUser(userData:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}/api/v1/auth/signin`, userData)
  }
  resetPasswordSendEmail(userData:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}/api/v1/auth/forgotPasswords`,userData)
  }
  resetPasswordCheckCode(userData:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseURL}/api/v1/auth/verifyResetCode`,userData)
  }
  resetPasswordNewPassword(userData:object):Observable<any>{
    return this._HttpClient.put(`${environment.baseURL}/api/v1/auth/resetPassword`,userData)
  }

  saveUserData():void{
    if (localStorage.getItem('userToken')!== null) {
      this.userData = jwtDecode(localStorage.getItem('userToken')!)
    }
  }

  signOut():void{
    this._Router.navigate(['/login']);
    localStorage.removeItem('userToken');
    this.userData = null;
  }
}

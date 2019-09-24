import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  public baseUrl = "http://api.npatelproject.site/api/v1/users";

  constructor(public _http : HttpClient) { }

  public setUserInfoLocalStorage = (data) => {
    localStorage.setItem('Issue_Track_userInfo',JSON.stringify(data));
  }

  public getLocalStorageUserinfo = () => {
    return localStorage.getItem('Issue_Track_userInfo');
  }
  
  public signUp = (signup_data) => {
    if(signup_data.signup_with === 'facebook' || signup_data.signup_with === 'google')
    {
      var data = new HttpParams()
        .set('email',signup_data.email)
        .set('userName',signup_data.name)
        .set('provider',signup_data.provider)
        .set('provider_id',signup_data.provider_id)
        .set('provider_pic',signup_data.provider_pic)
        .set('token',signup_data.token)
        .set('signup_with',signup_data.signup_with)
    }
    else
    {
      var data = new HttpParams()
      .set('email',signup_data.email)
      .set('password',signup_data.password)
      .set('userName',signup_data.userName)
      .set('mobileNumber',signup_data.mobileNumber)
      .set('country_code',signup_data.country_code)
      .set('country_name',signup_data.country_name)
      .set('signup_with',signup_data.signup_with)
    }
    let reponse = this._http.post(`${this.baseUrl}/signUp`,data);
    return reponse;
  }

  public verify_user_token = (token_data) => {
    let t_data = new HttpParams()
          .set('Token',token_data.Token)
    let reponse = this._http.post(`${this.baseUrl}/Verify-User`,t_data);
    return reponse;
  }

  public ForgotPwd = (data) => {
    let t_data = new HttpParams()
          .set('check_data',data.uname)
    let reponse = this._http.post(`${this.baseUrl}/forgot-password`,t_data);
    return reponse;
  }

  public getemail_from_token = (token) => {
    let data = new HttpParams()
                .set('Token',token.Token)
    let response = this._http.post(`${this.baseUrl}/get-email`,data);
    return response;
  }

  public recover_pwd = (params) => {
    const data = new HttpParams()
                .set('email',params.email)
                .set('password',params.password);
    let response = this._http.post(`${this.baseUrl}/recover-password`,data);
    return response;
  }

  public Login = (LoginParams) =>{
    if(LoginParams.signin_with === 'facebook' || LoginParams.signin_with === 'google')
    {
      var params = new HttpParams()
      .set('email',LoginParams.email)
      .set('userName',LoginParams.name)
      .set('provider',LoginParams.provider)
      .set('provider_id',LoginParams.provider_id)
      .set('provider_pic',LoginParams.provider_pic)
      .set('token',LoginParams.token)
      .set('signin_with',LoginParams.signin_with)
    }
    else
    {
      var params = new HttpParams()
        .set('userName',LoginParams.userName)
        .set('password',LoginParams.password)
        .set('signin_with',LoginParams.signin_with)
    }
    let response = this._http.post(`${this.baseUrl}/login`,params);
    return response;
  }

  public single_user_data = (userId) => {
    var params = new HttpParams()
                  .set('userId',userId)
    let response = this._http.post(`${this.baseUrl}/Single-User-Info`,params);
    return response;
  }

  public change_Pwd = (change_pwd_data) => {
    let params = new HttpParams()
                  .set('old_password',change_pwd_data.old_password)
                  .set('userId',change_pwd_data.userId)
                  .set('new_password',change_pwd_data.new_password);
    let reponse = this._http.post(`${this.baseUrl}/change-password`,params);
    return reponse;
  }

  public edit_profile_data = (user_id,User_data) => {
    let get_perticular_data = this._http.put(`${this.baseUrl}/${user_id}/edit-profile`,User_data);
      return get_perticular_data;
  }
}

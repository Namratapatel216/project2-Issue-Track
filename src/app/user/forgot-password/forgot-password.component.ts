import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from 'src/app/user-service.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public uname : any;

  constructor(public user_Service : UserServiceService,public _router : Router,public toastr:ToastrService,public cookie:CookieService) { }

  ngOnInit() {
    $(document).ready(function () {
      $("#Username").focus(function () {
        var inputted_uname = this.country_code = (<HTMLInputElement>document.getElementById('Username')).value;
        if(inputted_uname === undefined || inputted_uname === null || inputted_uname === '')
        {
          document.getElementById("forgot_password_validation").innerHTML = "Please Enter Username Or Email Address";
          document.getElementById("forgot_password_validation").style.display = "block";
          $("#forgot_pwd_submit").attr("disabled", true);
        }
        else
        {
          document.getElementById("forgot_password_validation").style.display = "none";
          $("#forgot_pwd_submit").attr("disabled", false);
        }
      });
    });
  }

  public signUp = () =>{
    this._router.navigate(['/Signup']);
  }

  public login = () => {
    this._router.navigate(['/Login']);
  }

  public fogot_pwd_data = () => {
    if(this.uname === undefined || this.uname === null || this.uname === '')
    {
      this.toastr.warning("Please enter emaill address or username");
    }
    else
    {
      $('#loader').show(0);
      let params = {
        uname : this.uname
      }
      this.user_Service.ForgotPwd(params).subscribe((apiResponse) => {
          if(apiResponse['status'] == 200)
          {
            $('#loader').hide(0);
            this.toastr.success(apiResponse['message']);
          }
          else
          {
            $('#loader').hide(0);
            this.toastr.error(apiResponse['message']);
          }
      });
    }
  }
}

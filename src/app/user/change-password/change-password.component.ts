import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import * as $ from 'jquery';
import { SocketService } from 'src/app/socket.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  public Issue_Track_AuthToken;
  public Issue_Track_UserId;
  public Issue_Track_UserName;
  public Issue_Track_userInfo;
  public Issue_Track_provider_pic;
  public Issue_Track_socialPlatform;

  constructor(private title:Title,public socket_service:SocketService,public toastr:ToastrService,public _router : Router,public cookie:CookieService,public user_service:UserServiceService) { }

  ngOnInit() {
    this.Issue_Track_AuthToken = this.cookie.get('Issue_Track_AuthToken');
    this.Issue_Track_UserId = this.cookie.get('Issue_Track_UserId');
    this.Issue_Track_UserName = this.cookie.get('Issue_Track_UserName');
    this.Issue_Track_provider_pic = this.cookie.get('Issue_Track_provider_pic');
    this.Issue_Track_socialPlatform = this.cookie.get('Issue_Track_socialPlatform');
    this.Issue_Track_userInfo = this.user_service.getLocalStorageUserinfo();
    this.title.setTitle('Change Password');

    $(document).ready(function () {
      $("#exampleInputPassword1").focus(function () {
        document.getElementById("password_validation").style.display = "none";
        document.getElementById("messagebox").style.display = "block";
        document.getElementById("tooltiptext").style.visibility = "visible";
      });
      $("#exampleInputPassword1").blur(function () {
        var inputted_pwd = (<HTMLInputElement>document.getElementById('exampleInputPassword1')).value;
        if(inputted_pwd === undefined || inputted_pwd === null || inputted_pwd === '')
        {
          document.getElementById("password_validation").innerHTML = "Please Enter Password";
          document.getElementById("password_validation").style.display = "block";
          document.getElementById("messagebox").style.display = "none";
          document.getElementById("tooltiptext").style.visibility = "hidden";
          $("#signup_submit").attr("disabled", true);
        }
        else
        {
          document.getElementById("password_validation").style.display = "none";
          document.getElementById("messagebox").style.display = "none";
          document.getElementById("tooltiptext").style.visibility = "hidden";
          $("#signup_submit").attr("disabled", false);
        }
      });

      $("#exampleInputConfirmPassword1").blur(function () {
        let inputted_retype_pwd = (<HTMLInputElement>document.getElementById('exampleInputConfirmPassword1')).value;
        let inputted_pwd = (<HTMLInputElement>document.getElementById('exampleInputPassword1')).value;
        if(inputted_retype_pwd === undefined || inputted_retype_pwd === null || inputted_retype_pwd === '')
        {
          document.getElementById("retype_password_validation").innerHTML = "Please Confirm Password.";
          document.getElementById("retype_password_validation").style.display = "block";
          $("#signup_submit").attr("disabled", true);
        }
        else
        {
          if(inputted_retype_pwd !== inputted_pwd)
          {
            document.getElementById("retype_password_validation").innerHTML = "Passwword Does not Match.";
            document.getElementById("retype_password_validation").style.display = "block";
            $("#signup_submit").attr("disabled", true);
          }
          else
          {
            document.getElementById("retype_password_validation").style.display = "none";
            $("#signup_submit").attr("disabled", false);
          }
        }
      });

      $("#exampleInputOldPassword1").blur(function () {
        let inputted_old_pwd = (<HTMLInputElement>document.getElementById('exampleInputOldPassword1')).value;
        if(inputted_old_pwd === undefined || inputted_old_pwd === null || inputted_old_pwd === '')
        {
          document.getElementById("old_password_validation").innerHTML = "Please Enter Old Password.";
          document.getElementById("old_password_validation").style.display = "block";
          $("#signup_submit").attr("disabled", true);
        }
        else
        {
            document.getElementById("old_password_validation").style.display = "none";
            $("#signup_submit").attr("disabled", false);
        }
      });
  });

  }

  public check_letter : Boolean = false;
  public check_capital : Boolean = false;
  public check_number : Boolean = false;
  public check_length : Boolean = false;

  public PassRequirements = (myInput) => {
  let letter = document.getElementById("letter");
  let capital = document.getElementById("capital");
  let number = document.getElementById("number");
  let length = document.getElementById("length");
    var lowerCaseLetters = /[a-z]/g;
    if (myInput.match(lowerCaseLetters)) {
      letter.classList.remove("invalid");
      letter.classList.add("valid");
      this.check_letter = true;
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
      this.check_letter = false;
    }
    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if (myInput.match(upperCaseLetters)) {
      capital.classList.remove("invalid");
      capital.classList.add("valid");
      this.check_capital = true;
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
      this.check_capital = false;
    }
    // Validate numbers
    var numbers = /[0-9]/g;
    if (myInput.match(numbers)) {
      number.classList.remove("invalid");
      number.classList.add("valid");
      this.check_number = true;
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
      this.check_number = false;
    }
    // Validate length
    if (myInput.length >= 7 && myInput.length <= 14) {
      length.classList.remove("invalid");
      length.classList.add("valid");
      this.check_length = true;
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
      this.check_length = false;
    }
  }

  public checkstatus : any = () =>
  {
    if(this.Issue_Track_AuthToken === undefined || this.Issue_Track_AuthToken === null || this.Issue_Track_AuthToken === '')
    {
        this._router.navigate(['/Login']);
        return false;
    }
    else
    {
        return true;
    }
  }

  public logout = () => {
    let logged_in_user_id = this.cookie.get('Issue_Track_UserId');
    let userId_data = {
      userId: logged_in_user_id
    }
    this.socket_service.Logout(userId_data).subscribe((apiResponse) => {
      if (apiResponse['status'] == 200) {
        this.cookie.delete('Issue_Track_AuthToken');
        this.cookie.delete('Issue_Track_UserId');
        this.cookie.delete('Issue_Track_UserName');
        this.cookie.delete('Issue_Track_email');
        this.user_service.setUserInfoLocalStorage("");
        this._router.navigate(['/']);
        this.toastr.success(apiResponse['message']);
      }
      else {
        this.toastr.warning(apiResponse['message']);
      }
    });
  }

  public change_password = () => {
    this._router.navigate(['change-password']);
  }

  public edit_profile = () => {
    this._router.navigate(['edit-profile']);
  }

  public password;
  public cnf_pwd;
  public old_pwd;
  public change_password_data = () => {
    if(this.old_pwd === undefined || this.old_pwd === null || this.old_pwd === '')
    {
      this.toastr.warning("Please Enter Old Password");
    }
    else if(this.password === undefined || this.password === null || this.password === '')
    {
      this.toastr.warning("Please Enter Password");
    } 
    else if(this.check_length !== true || this.check_capital !== true || this.check_letter !== true || this.check_number !== true)
    {
      this.toastr.warning("Password Does Not Met Requirements");
    }
    else if(this.cnf_pwd === undefined || this.cnf_pwd === null || this.cnf_pwd === '')
    {
      this.toastr.warning("Please Enter Correct Password in Confirm Password Field");
    }
    else if(this.cnf_pwd !== this.password)
    {
      this.toastr.warning("Password and Confirm password does not match");
    }
    else
    {
      let change_pwd_params = {
        old_password : this.old_pwd,
        new_password : this.password,
        userId : this.Issue_Track_UserId
      }

      this.user_service.change_Pwd(change_pwd_params).subscribe((apiResponse) => {

          if(apiResponse['status'] == 200)
          {
              this.toastr.success(apiResponse['message']);
          }    
          else
          {
            this.toastr.error(apiResponse['message']);
          }
      });
    }

  }

}

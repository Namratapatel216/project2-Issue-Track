import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from 'src/app/user-service.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {
  public password: string;
  public cnf_pwd : string;
  public email_from_token;
  public email;
  constructor(public actiroute:ActivatedRoute,public user_Service : UserServiceService,public _router : Router,public toastr:ToastrService,public cookie:CookieService) { }

  ngOnInit() {
    let token = this.actiroute.snapshot.paramMap.get("Token");
    let Token_res = {
      Token : token
    }
    this.email_from_token = this.user_Service.getemail_from_token(Token_res).subscribe(
    (apiResponse) => {

      if(apiResponse['status'] == 200)
      {
        this.email_from_token = apiResponse['data']['email'];
      }
      else
      {
          this.toastr.warning(apiResponse['message']);
          this._router.navigate(['/forgot-password']);
      }
    });

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
          $("#recover_pwd_submit").attr("disabled", true);
        }
        else
        {
          document.getElementById("password_validation").style.display = "none";
          document.getElementById("messagebox").style.display = "none";
          document.getElementById("tooltiptext").style.visibility = "hidden";
          $("#recover_pwd_submit").attr("disabled", false);
        }
      });
      $("#exampleInputConfirmPassword1").blur(function () {
        let inputted_retype_pwd = (<HTMLInputElement>document.getElementById('exampleInputConfirmPassword1')).value;
        let inputted_pwd = (<HTMLInputElement>document.getElementById('exampleInputPassword1')).value;
        if(inputted_retype_pwd === undefined || inputted_retype_pwd === null || inputted_retype_pwd === '')
        {
          document.getElementById("retype_password_validation").innerHTML = "Please Confirm Password.";
          document.getElementById("retype_password_validation").style.display = "block";
          $("#recover_pwd_submit").attr("disabled", true);
        }
        else
        {
          if(inputted_retype_pwd !== inputted_pwd)
          {
            document.getElementById("retype_password_validation").innerHTML = "Passwword Does not Match.";
            document.getElementById("retype_password_validation").style.display = "block";
            $("#recover_pwd_submit").attr("disabled", true);
          }
          else
          {
            document.getElementById("retype_password_validation").style.display = "none";
            $("#recover_pwd_submit").attr("disabled", false);
          }
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

  public signUp = () =>{
    this._router.navigate(['/Signup']);
  }

  public login = () => {
    this._router.navigate(['/Login']);
  }

  public recover_pwd_data = () => {
    if(this.password === undefined || this.password === null || this.password === '')
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
      let params = {
        email : this.email_from_token,
        password : this.password
      }
      this.user_Service.recover_pwd(params).subscribe((apirespoonse) => {
          if(apirespoonse['status'] == 200)
          {
            this.toastr.success(apirespoonse['message']);
            this._router.navigate(['/login']);
          }
          else
          {
            this.toastr.error(apirespoonse['message']);
          }

      });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { AuthService, FacebookLoginProvider, SocialUser, GoogleLoginProvider } from 'angularx-social-login';
import * as $ from 'jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public uname : string;
  public password: string;
  public Issue_Track_AuthToken;
  public Issue_Track_UserId;
  public Issue_Track_UserName;
  public Issue_Track_userInfo;
  public responseData: any;
  public userPostData = {
  email: '',
  name: '',
  provider: '',
  provider_id: '',
  provider_pic: '',
  token: '',
  signin_with:''
  };
  //private authService: AuthService,

  constructor(private authService: AuthService,public user_service : UserServiceService,public _router : Router, public toastr : ToastrService,public cookie : CookieService) { }

  ngOnInit() {
    this.Issue_Track_AuthToken = this.cookie.get('Issue_Track_AuthToken');
    this.Issue_Track_UserId = this.cookie.get('Issue_Track_UserId');
    this.Issue_Track_UserName = this.cookie.get('Issue_Track_UserName');
    this.Issue_Track_userInfo = this.user_service.getLocalStorageUserinfo();
    this.checkstatus();
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
          $("#login_submit").attr("disabled", true);
        }
        else
        {
          document.getElementById("messagebox").style.display = "none";
          document.getElementById("tooltiptext").style.visibility = "hidden";
          $("#login_submit").attr("disabled", false);
        }
      });
      $("#Username").blur(function () {
        var illegalChars = /\W/; // allow letters, numbers, and underscores
        var inputted_uname = this.country_code = (<HTMLInputElement>document.getElementById('Username')).value;
        if(inputted_uname === undefined || inputted_uname === null || inputted_uname === '')
        {
          document.getElementById("Username_validation").innerHTML = "Please Enter Username";
          document.getElementById("Username_validation").style.display = "block";
          $("#login_submit").attr("disabled", true);
        }
        else
        {
          if(illegalChars.test(inputted_uname)  ){
            document.getElementById("Username_validation").innerHTML = "The Username contains illegal characters.";
            document.getElementById("Username_validation").style.display = "block";
            $("#login_submit").attr("disabled", true);
          }
          else
          {
            document.getElementById("Username_validation").style.display = "none";
            $("#login_submit").attr("disabled", false);
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

  public checkstatus : any = () =>
  {
      if(this.Issue_Track_AuthToken === undefined || this.Issue_Track_AuthToken === null || this.Issue_Track_AuthToken === '')
      {
          this._router.navigate(['/Login']);
          return false;
      }
      else
      {
          this._router.navigate(['/Dashboard']);
          return true;
      }
  }

  public signUp = () => {
      this._router.navigate(['/Signup']);
  }

  public login_data = () =>{
    let illegalChars = /\W/; // allow letters, numbers, and underscores
    if(this.uname === undefined || this.uname === null || this.uname === '')
    {
      this.toastr.warning("Please Enter Username");
    }
    else if(illegalChars.test(this.uname))
    {
      this.toastr.warning("The username contains illegal characters.");
    }
    else if(this.password === undefined || this.password === null || this.password === '')
    {
      this.toastr.warning("Please Enter Password");
    }
    else if(this.check_length !== true || this.check_capital !== true || this.check_letter !== true || this.check_number !== true)
    {
      this.toastr.warning("Password Does Not Met Requirements");
    }
    else
    {
      const LoginParams = {
        userName : this.uname,
        password : this.password,
        signin_with : 'normal'
      }
      this.user_service.Login(LoginParams).subscribe((apiResponse) => {
        if(apiResponse['status'] == 200)
        {
          this.toastr.warning(apiResponse['message']);
          this.cookie.set('Issue_Track_AuthToken',apiResponse['data']['authToken'] )
          this.cookie.set('Issue_Track_UserId',apiResponse['data']['userDetails']['userId'] );
          this.cookie.set('Issue_Track_UserName',apiResponse['data']['userDetails']['userName']);
          this.cookie.set('Issue_Track_email',apiResponse['data']['userDetails']['email']);
          this.cookie.set('Issue_Track_socialPlatform',apiResponse['data']['userDetails']['socialPlatform']);
          this.user_service.setUserInfoLocalStorage(apiResponse['data']['userDetails']);
          this._router.navigate(['/Dashboard']);
        }
        else
        {
          this.toastr.error(apiResponse['message']);
        }
      });
    }
  }

  public signInWithFB = () => {
    let s_with = 'facebook';
    let socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    this.authService.signIn(socialPlatformProvider).then(userData => {
      this.apiConnection(userData,s_with);
   });
  }

  public signInWithGoogle = () => {
    let s_with = 'google';
    let socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    this.authService.signIn(socialPlatformProvider).then(userData => {
      this.apiConnection(userData,s_with);
   });
  }
  
  public apiConnection(data,signin_with) {
    this.userPostData.email = data.email;
    this.userPostData.name = data.name;
    this.userPostData.provider = data.provider;
    this.userPostData.provider_id = data.id;
    this.userPostData.provider_pic = data.image;
    this.userPostData.token = data.token;
    this.userPostData.signin_with = signin_with;

    $('#loader').show(0);
    this.user_service.Login(this.userPostData).subscribe((apiResponse) => {
      if(apiResponse['status'] == 200)
      {
        $('#loader').hide(0);
        this.toastr.warning(apiResponse['message']);
        this.cookie.set('Issue_Track_AuthToken',apiResponse['data']['authToken'] )
        this.cookie.set('Issue_Track_UserId',apiResponse['data']['userDetails']['userId'] );
        this.cookie.set('Issue_Track_UserName',apiResponse['data']['userDetails']['userName']);
        this.cookie.set('Issue_Track_provider_pic',apiResponse['data']['userDetails']['provider_pic']);
        this.cookie.set('Issue_Track_socialPlatform',apiResponse['data']['userDetails']['socialPlatform']);
        this.cookie.set('Issue_Track_email',apiResponse['data']['userDetails']['email']);
        this.user_service.setUserInfoLocalStorage(apiResponse['data']['userDetails']);
        this._router.navigate(['/Dashboard']);
      }
      else
      {
        $('#loader').hide(0);
        this.toastr.error(apiResponse['message']);
      }
    });
  }

}

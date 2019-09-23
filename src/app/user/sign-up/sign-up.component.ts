import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import * as $ from 'jquery';
import { AuthService, FacebookLoginProvider, SocialUser, GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public cntry_code;
  public updated_number;
  public all_the_countries_name;
  public country_keys;
  public vals;
  public entries;
  public uname : string;
  public mobileNumber: any;
  public email: string;
  public password: string;
  public cnf_pwd : string;
  public country_code: string;
  public name_of_country: any;
  public baseUrl = "http://localhost:3000/api/v1/users";
  public responseData: any;
  public userPostData = {
  email: '',
  name: '',
  provider: '',
  provider_id: '',
  provider_pic: '',
  token: '',
  signup_with:''
  };
  //private authService: AuthService,

  constructor(private authService: AuthService,public user_service: UserServiceService, public _router: Router, public toastr: ToastrService, public cookie: CookieService) { }

  ngOnInit() {
    this.all_the_countries_name = { "BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique" };
    this.country_keys = Object.keys(this.all_the_countries_name);
    this.vals = Object.values(this.all_the_countries_name);
    this.entries = Object.entries(this.all_the_countries_name);

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
      $("#Username").blur(function () {
        var illegalChars = /\W/; // allow letters, numbers, and underscores
        var inputted_uname = this.country_code = (<HTMLInputElement>document.getElementById('Username')).value;
        if(inputted_uname === undefined || inputted_uname === null || inputted_uname === '')
        {
          document.getElementById("Username_validation").innerHTML = "Please Enter Username";
          document.getElementById("Username_validation").style.display = "block";
        }
        else
        {
          if(illegalChars.test(inputted_uname)  ){
            document.getElementById("Username_validation").innerHTML = "The Username contains illegal characters.";
            document.getElementById("Username_validation").style.display = "block";
          }
          else
          {
            let data = {userName : inputted_uname};
            $.ajax({
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
              url: `http://localhost:3000/api/v1/users/check_user`,
              success: function(data) {
                  if(data.status != 404)
                  {
                    document.getElementById("Username_validation").innerHTML = "Username already exists";
                    document.getElementById("Username_validation").style.display = "block";
                    $("#signup_submit").attr("disabled", true);
                  }
                  else
                  {
                    document.getElementById("Username_validation").style.display = "none";
                    $("#signup_submit").attr("disabled", false);
                  }
              }
            });
          }
        }
      });
      $("#exampleFormControlSelect2").blur(function () {
        let Selected_cntry = (<HTMLInputElement>document.getElementById('exampleFormControlSelect2')).value;
        if(Selected_cntry === 'undefined' || Selected_cntry === null || Selected_cntry === '' || Selected_cntry === undefined)
        {
          document.getElementById("mobile_number_validation").innerHTML = "Please Select Country For Mobile Number";
          document.getElementById("mobile_number_validation").style.display = "block";
          $("#signup_submit").attr("disabled", true);
        }
        else
        {
          document.getElementById("mobile_number_validation").style.display = "none";
          $("#signup_submit").attr("disabled", false);
        }
      });
      $('#mobileNumber').on('keypress, keydown', function (event) {
        //alert(readOnlyLength);
        var $field = $(this);
        var readOnly_chars = (<HTMLInputElement>document.getElementById('cc_code')).value;
        var readOnlyLength = readOnly_chars.length;
        $('#mobileNumber').text(event.which + '-' + this.selectionStart);
        if ((event.which != 37 && (event.which != 39)) &&
          ((this.selectionStart < readOnlyLength) ||
            ((this.selectionStart == readOnlyLength) && (event.which == 8)))) {
          return false;
        }
      });
      $("#mobileNumber").blur(function () {
        let entered_m_no = (<HTMLInputElement>document.getElementById('mobileNumber')).value;
        var readOnly_chars = (<HTMLInputElement>document.getElementById('cc_code')).value;
        if(entered_m_no === readOnly_chars)
        {
          document.getElementById("mobile_number_validation").innerHTML = "Please Enter Mobile Number";
          document.getElementById("mobile_number_validation").style.display = "block";
          $("#signup_submit").attr("disabled", true);
        }
        else
        {
          document.getElementById("mobile_number_validation").style.display = "none";
          $("#signup_submit").attr("disabled", false);
        }
      });
      $("#exampleInputEmail1").blur(function () {
        let emailregx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let inputted_email = (<HTMLInputElement>document.getElementById('exampleInputEmail1')).value;
        if(inputted_email === undefined || inputted_email === null || inputted_email === '')
        {
          document.getElementById("email_validation").innerHTML = "Please Enter Email Address";
          document.getElementById("email_validation").style.display = "block";
          $("#signup_submit").attr("disabled", true);
        }
        else
        {
          if(emailregx.test(inputted_email)  )
          {
            document.getElementById("email_validation").style.display = "none";
            let data = {email : inputted_email};
            $.ajax({
              type: 'POST',
              data: JSON.stringify(data),
              contentType: 'application/json',
              url: `http://localhost:3000/api/v1/users/check_email`,
              success: function(data) {
                  if(data.status != 404)
                  {
                    document.getElementById("email_validation").innerHTML = "Email already exists";
                    document.getElementById("email_validation").style.display = "block";
                    $("#signup_submit").attr("disabled", true);
                  }
                  else
                  {
                    document.getElementById("email_validation").style.display = "none";
                    $("#signup_submit").attr("disabled", false);
                  }
              }
            });
          }
          else
          {
            document.getElementById("email_validation").innerHTML = "Please Enter Valid Email Address";
            document.getElementById("email_validation").style.display = "block";
            $("#signup_submit").attr("disabled", false);
          }
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
    });
  }

  public getcountryname = (cntr_name) => {
    let all_abbr_code = { "BD": "880", "BE": "32", "BF": "226", "BG": "359", "BA": "387", "BB": "+1-246", "WF": "681", "BL": "590", "BM": "+1-441", "BN": "673", "BO": "591", "BH": "973", "BI": "257", "BJ": "229", "BT": "975", "JM": "+1-876", "BV": "", "BW": "267", "WS": "685", "BQ": "599", "BR": "55", "BS": "+1-242", "JE": "+44-1534", "BY": "375", "BZ": "501", "RU": "7", "RW": "250", "RS": "381", "TL": "670", "RE": "262", "TM": "993", "TJ": "992", "RO": "40", "TK": "690", "GW": "245", "GU": "+1-671", "GT": "502", "GS": "", "GR": "30", "GQ": "240", "GP": "590", "JP": "81", "GY": "592", "GG": "+44-1481", "GF": "594", "GE": "995", "GD": "+1-473", "GB": "44", "GA": "241", "SV": "503", "GN": "224", "GM": "220", "GL": "299", "GI": "350", "GH": "233", "OM": "968", "TN": "216", "JO": "962", "HR": "385", "HT": "509", "HU": "36", "HK": "852", "HN": "504", "HM": " ", "VE": "58", "PR": "+1-787 and 1-939", "PS": "970", "PW": "680", "PT": "351", "SJ": "47", "PY": "595", "IQ": "964", "PA": "507", "PF": "689", "PG": "675", "PE": "51", "PK": "92", "PH": "63", "PN": "870", "PL": "48", "PM": "508", "ZM": "260", "EH": "212", "EE": "372", "EG": "20", "ZA": "27", "EC": "593", "IT": "39", "VN": "84", "SB": "677", "ET": "251", "SO": "252", "ZW": "263", "SA": "966", "ES": "34", "ER": "291", "ME": "382", "MD": "373", "MG": "261", "MF": "590", "MA": "212", "MC": "377", "UZ": "998", "MM": "95", "ML": "223", "MO": "853", "MN": "976", "MH": "692", "MK": "389", "MU": "230", "MT": "356", "MW": "265", "MV": "960", "MQ": "596", "MP": "+1-670", "MS": "+1-664", "MR": "222", "IM": "+44-1624", "UG": "256", "TZ": "255", "MY": "60", "MX": "52", "IL": "972", "FR": "33", "IO": "246", "SH": "290", "FI": "358", "FJ": "679", "FK": "500", "FM": "691", "FO": "298", "NI": "505", "NL": "31", "NO": "47", "NA": "264", "VU": "678", "NC": "687", "NE": "227", "NF": "672", "NG": "234", "NZ": "64", "NP": "977", "NR": "674", "NU": "683", "CK": "682", "XK": "", "CI": "225", "CH": "41", "CO": "57", "CN": "86", "CM": "237", "CL": "56", "CC": "61", "CA": "1", "CG": "242", "CF": "236", "CD": "243", "CZ": "420", "CY": "357", "CX": "61", "CR": "506", "CW": "599", "CV": "238", "CU": "53", "SZ": "268", "SY": "963", "SX": "599", "KG": "996", "KE": "254", "SS": "211", "SR": "597", "KI": "686", "KH": "855", "KN": "+1-869", "KM": "269", "ST": "239", "SK": "421", "KR": "82", "SI": "386", "KP": "850", "KW": "965", "SN": "221", "SM": "378", "SL": "232", "SC": "248", "KZ": "7", "KY": "+1-345", "SG": "65", "SE": "46", "SD": "249", "DO": "+1-809 and 1-829", "DM": "+1-767", "DJ": "253", "DK": "45", "VG": "+1-284", "DE": "49", "YE": "967", "DZ": "213", "US": "1", "UY": "598", "YT": "262", "UM": "1", "LB": "961", "LC": "+1-758", "LA": "856", "TV": "688", "TW": "886", "TT": "+1-868", "TR": "90", "LK": "94", "LI": "423", "LV": "371", "TO": "676", "LT": "370", "LU": "352", "LR": "231", "LS": "266", "TH": "66", "TF": "", "TG": "228", "TD": "235", "TC": "+1-649", "LY": "218", "VA": "379", "VC": "+1-784", "AE": "971", "AD": "376", "AG": "+1-268", "AF": "93", "AI": "+1-264", "VI": "+1-340", "IS": "354", "IR": "98", "AM": "374", "AL": "355", "AO": "244", "AQ": "", "AS": "+1-684", "AR": "54", "AU": "61", "AT": "43", "AW": "297", "IN": "91", "AX": "+358-18", "AZ": "994", "IE": "353", "ID": "62", "UA": "380", "QA": "974", "MZ": "258" };
    let abbr_code_keys = Object.keys(all_abbr_code);
    let abbr_Code_vals = Object.values(all_abbr_code);
    let abbr_code_entries = Object.entries(all_abbr_code);
    for (let x in abbr_code_entries) {
      if (abbr_code_entries[x][0] == cntr_name) {
        this.cntry_code = abbr_code_entries[x][1];
        return this.cntry_code;
      }
    }
  }

  public login = () => {
    this._router.navigate(['/Login']);
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

  public signup_data = () => {
    this.country_code = (<HTMLInputElement>document.getElementById('cc_code')).value;
    this.name_of_country = (<HTMLInputElement>document.getElementById('cc_name')).value;
    let illegalChars = /\W/; // allow letters, numbers, and underscores
    if(this.uname === undefined || this.uname === null || this.uname === '')
    {
      this.toastr.warning("Please Enter Username");
    }
    else if(illegalChars.test(this.uname))
    {
      this.toastr.warning("The username contains illegal characters.");
    }
    else if(this.mobileNumber === undefined || this.mobileNumber === null || this.mobileNumber === '')
    {
      this.toastr.warning("Please Enter Mobile Number");
    }
    else if((this.name_of_country === 'default' || this.name_of_country === '' || this.name_of_country === null || this.name_of_country === undefined) || (this.mobileNumber === undefined || this.mobileNumber === null || this.mobileNumber === ''))
    {
      this.toastr.warning("Please Enter Mobile Number with country code");
    }
    else if(this.email === undefined || this.email === null || this.email === '')
    {
      this.toastr.warning("Please Enter Email Address");
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
      this.updated_number = this.mobileNumber;
      this.mobileNumber = this.mobileNumber.substr(this.country_code.length);
      let signup_data = {
        userName : this.uname,
        mobileNumber : this.mobileNumber,
        email : this.email,
        password : this.password,
        country_code : this.country_code,
        country_name : this.name_of_country,
        signup_with : 'normal'
      };
      $('#loader').show(0);
      this.user_service.signUp(signup_data).subscribe((apiresponse) => {
        if(apiresponse['status'] == 200)
          {
              this.mobileNumber = this.updated_number;
              $('#loader').hide(0); 
              this.toastr.warning(apiresponse['message']);
              this._router.navigate(['/Login']);

          }
          else
          {
            this.mobileNumber = this.updated_number;
            $('#loader').hide(0); 
            this.toastr.warning(apiresponse['message']);
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

  public apiConnection(data,signup_with) {
    this.userPostData.email = data.email;
    this.userPostData.name = data.name;
    this.userPostData.provider = data.provider;
    this.userPostData.provider_id = data.id;
    this.userPostData.provider_pic = data.photoUrl;
    this.userPostData.token = data.token;
    this.userPostData.signup_with = signup_with;

    $('#loader').show(0);
    this.user_service.signUp(this.userPostData).subscribe((apiresponse) => {
      if(apiresponse['status'] == 200)
        {
            $('#loader').hide(0); 
            this.toastr.warning(apiresponse['message']);
            this._router.navigate(['/Login']);

        }
        else
        {
          $('#loader').hide(0); 
          this.toastr.warning(apiresponse['message']);
        }
    });

  }

}

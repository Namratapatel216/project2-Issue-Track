import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { UserServiceService } from 'src/app/user-service.service';

@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.css']
})
export class VerifyUserComponent implements OnInit {

  constructor(public actiroute:ActivatedRoute,private cookie: CookieService,public _router : Router,public user_service : UserServiceService,private toastr: ToastrService) { }

  ngOnInit() {
    let token = this.actiroute.snapshot.paramMap.get("Token");
    let Token_res = {
      Token : token
    }
    alert(Token_res);

    this.user_service.verify_user_token(Token_res).subscribe((apiResponse) => {
      if(apiResponse['status'] == 200)
      {
        this.toastr.success(apiResponse['message']);
        this._router.navigate(['/Login']);
      }
      else
      {
          this.toastr.warning(apiResponse['message']);
          //this._router.navigate(['/forgot-password']);
      }

    });
  }

}

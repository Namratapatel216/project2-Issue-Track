import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyUserComponent } from './verify-user/verify-user.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
@NgModule({
  declarations: [LoginComponent, SignUpComponent, VerifyUserComponent, ForgotPasswordComponent, RecoverPasswordComponent, EditProfileComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'Signup', component: SignUpComponent },
      { path: 'Verify-User/:Token', component: VerifyUserComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'recover-password/:Token', component: RecoverPasswordComponent },
      { path: 'edit-profile', component: EditProfileComponent },
      { path: 'change-password', component: ChangePasswordComponent },
    ])
  ]
})
export class UserModule { }

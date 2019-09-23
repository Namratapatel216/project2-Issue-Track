import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { NgxSmartModalModule,NgxSmartModalService } from 'ngx-smart-modal';
import { NgxEditorModule } from 'ngx-editor';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('1389013818081403')
  },
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('306037087614-hqebo6tvbdr8oa1goq76do5msutbfukm.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxEditorModule,
    DashboardModule,
    AppRoutingModule,
    NgxPaginationModule,
    FilterPipeModule,
    Ng2SearchPipeModule,
    OrderModule,
    SocialLoginModule.initialize(config),
    UserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    NgxSmartModalModule.forRoot(),
    RouterModule.forRoot([
      {path:'Login',component:LoginComponent},
      {path:'',redirectTo:'Login',pathMatch:'full'},
      {path:'*',component:LoginComponent},
      {path:'**',component:LoginComponent}
    ])
  ],
  providers: [CookieService, NgxSmartModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }

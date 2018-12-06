import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
  declarations: [
    LoginComponent,
    SigninComponent
  ],
  imports: [
    SharedModule
  ]
})
export class PublicModule { }

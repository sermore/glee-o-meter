import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProfileComponent } from './profile/profile.component';
import { ConfigService, configServiceInitializerFactory } from './services/config.service';
import { TokenInterceptor } from './services/token.interceptor';
import { SharedModule } from './shared/shared.module';
import { PublicModule } from './public/public.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule,
    SharedModule,
    PublicModule,
    AppRoutingModule
  ],
  providers: [
    ConfigService, {
      provide: APP_INITIALIZER,
      useFactory: configServiceInitializerFactory,
      deps: [ConfigService],
      multi: true
    },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

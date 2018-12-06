import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { GleeComponent } from './components/glee/glee.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { Role } from './models/user';

const routes: Routes = [
  {
    path: '',
    data: { roles: [Role.ADMIN, Role.USER, Role.USER_MANAGER] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'glee', component: GleeComponent,
        data: { roles: [Role.ADMIN, Role.USER] }
      },
      {
        path: 'profile', component: ProfileComponent,
        data: { roles: [Role.ADMIN, Role.USER, Role.USER_MANAGER] },
      },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
    ],
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signin', component: SignInComponent },
    ]
  },
  { path: '', redirectTo: '/glee', pathMatch: 'full' },
  { path: '**', redirectTo: '/glee', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

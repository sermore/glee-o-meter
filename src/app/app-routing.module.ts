import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SigninComponent } from './components/signin/signin.component';
import { Role } from './models/user';

const routes: Routes = [
  {
    path: '',
    data: { roles: [Role.ADMIN, Role.USER, Role.USER_MANAGER] },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'profile', component: ProfileComponent,
        data: { roles: [Role.ADMIN, Role.USER, Role.USER_MANAGER] },
      },
      { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
      { path: '', loadChildren: './user/user.module#UserModule' },
    ],
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signin', component: SigninComponent },
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

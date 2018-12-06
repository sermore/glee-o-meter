import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from '../models/user';
import { UsersComponent } from './users/users.component';
import { AuthGuard } from '../auth.guard';

const routes: Routes = [
  {
    path: '',
    data: { roles: [Role.ADMIN, Role.USER_MANAGER] },
    canActivateChild: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

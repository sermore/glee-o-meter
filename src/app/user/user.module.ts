import { NgModule } from '@angular/core';
import { GleeComponent } from './glee/glee.component';
import { GleeDetailComponent } from './glee-detail/glee-detail.component';
import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    GleeComponent,
    GleeDetailComponent,
  ],
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  entryComponents: [
    GleeDetailComponent
  ]

})
export class UserModule { }

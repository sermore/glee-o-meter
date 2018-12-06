import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { createUniqueEmailValidator } from 'src/app/helpers/unique-email.validator';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { ChangePasswordComponent } from 'src/app/shared/change-password/change-password.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  private currentUser: User;
  private dialogRef: MatDialogRef<ChangePasswordComponent>;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private userService: UserService,
    private authentication: AuthenticationService,
  ) { }

  ngOnInit() {
    console.log('init profile');
    this.currentUser = new User();
    Object.assign(this.currentUser, this.authentication.loggedUser);
    this.init(this.currentUser);
  }

  private init(user: User) {
    console.log(`init profile after user retrieved ${user.email}`);
    this.profileForm = new FormGroup({
      email: new FormControl(user.email,
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: createUniqueEmailValidator(this.userService, this.snackBar, user.email),
          updateOn: 'blur'
        }),
      minGleePerDay: new FormControl(user.minGleePerDay, Validators.required),
    });
  }

  changePassword() {
    this.dialogRef = this.dialog.open(ChangePasswordComponent, {
      disableClose: true,
      autoFocus: true,
      minWidth: '300px',
      data: {
        user: this.currentUser,
        adminMode: false
      }
    });
  }

  submit() {
    this.currentUser.email = this.profileForm.get('email').value;
    this.currentUser.minGleePerDay = Number(this.profileForm.get('minGleePerDay').value);
    this.userService.update(this.currentUser).subscribe(() => {
      console.log(this.currentUser);
      if (this.authentication.currentUserUpdateForceLogout(this.currentUser)) {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
      }
    });
  }

}

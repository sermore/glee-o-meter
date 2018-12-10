import { Component, OnInit, Inject } from '@angular/core';
import { User, Role } from 'src/app/models/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { createUniqueEmailValidator } from 'src/app/helpers/unique-email.validator';
import { StoreServiceDataSource } from 'src/app/helpers/store-service-data-source';
import { formatError } from 'src/app/services/store-service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  user: User;
  userForm: FormGroup;
  private index: number;
  dataSource: StoreServiceDataSource<User>;
  private currentUser: User;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<UserDetailComponent>,
    private snackBar: MatSnackBar,
    private authentication: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.user = data.user;
    this.index = data.index;
    this.dataSource = data.dataSource;
    this.currentUser = data.currentUser;
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      email: new FormControl(this.user.email,
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: createUniqueEmailValidator(this.userService, this.snackBar, this.user.email),
          updateOn: 'blur'
        }),
      role: new FormControl(this.user.role, Validators.required),
      minGleePerDay: new FormControl(this.user.minGleePerDay, Validators.required),
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    const user: User = new User();
    Object.assign(user, this.user);
    Object.assign(user, {
      email: String(this.userForm.value.email),
      role: Role[String(this.userForm.value.role)],
      minGleePerDay: Number(this.userForm.value.minGleePerDay),
    });
    if (this.index === null) {
      this.dataSource.create(user).subscribe(
        res => {
          this.snackBar.open(`User ${res.email} created.`);
          this.dialogRef.close(user);
        },
        err => this.snackBar.open(`User creation failed due to ${formatError(err)}.`)
      );
    } else {
      this.dataSource.update(this.index, user).subscribe(
        res => {
          this.snackBar.open(`User ${user.email} updated.`);
          this.dialogRef.close(user);
          if (user.id === this.currentUser.id && this.authentication.currentUserUpdateForceLogout(user)) {
              this.snackBar.open(`Changed email or role of the current user: forced logout`);
          }
        },
        err => this.snackBar.open(`User update failed due to ${formatError(err)}.`)
      );
    }
  }
}

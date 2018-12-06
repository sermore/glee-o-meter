import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, Validators, FormControl, NgControl, AbstractControl } from '@angular/forms';
import { User } from 'src/app/models/user';
import { ApiError, formatError } from 'src/app/services/store-service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  user: User;
  adminMode: boolean;
  pwdForm: FormGroup;

  constructor(
    private userService: UserService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private snackBar: MatSnackBar
  ) {
    this.user = data.user;
    this.adminMode = data.adminMode;
  }

  ngOnInit() {
    if (this.adminMode) {
      this.pwdForm = new FormGroup({
        newPassword: new FormControl('', Validators.required),
      });
    } else {
      this.pwdForm = new FormGroup({
        oldPassword: new FormControl('', Validators.required),
        newPassword: new FormControl('', Validators.required),
        newPassword1: new FormControl('', Validators.required),
      }, (c: AbstractControl) =>
          c.get('newPassword').value === c.get('newPassword1').value ? null : { InvalidPassword: true }
      );
    }
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    console.log('change password');
    const oldPassword = this.pwdForm.get('oldPassword') ? this.pwdForm.get('oldPassword').value : '';
    this.userService.changePassword(this.user.id, oldPassword, this.pwdForm.get('newPassword').value)
      .subscribe(
        res => {
          this.snackBar.open(`Password for user ${this.user.email} changed.`);
          this.dialogRef.close(this.user);
        },
        err => this.snackBar.open(`Change password failed due to ${formatError(err)}.`)
      );
  }
}

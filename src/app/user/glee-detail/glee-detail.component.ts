import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Glee } from 'src/app/models/glee';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { StoreServiceDataSource } from 'src/app/helpers/store-service-data-source';
import { formatError } from 'src/app/services/store-service';

@Component({
  selector: 'app-glee-detail',
  templateUrl: './glee-detail.component.html',
  styleUrls: ['./glee-detail.component.scss']
})
export class GleeDetailComponent implements OnInit {

  index: number;
  glee: Glee;
  gleeForm: FormGroup;
  adminUser: boolean;
  users$: Observable<User[]>;
  dataSource: StoreServiceDataSource<Glee>;

  constructor(private userService: UserService,
    private dialogRef: MatDialogRef<GleeDetailComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) data) {
    this.index = data.index;
    this.glee = data.glee;
    this.adminUser = data.adminUser;
    this.dataSource = data.dataSource;
    this.users$ = this.userService.load(null, null).pipe(map(result => result.data));
  }

  ngOnInit() {
    this.gleeForm = this.adminUser ? new FormGroup({
      date: new FormControl(this.glee.date, Validators.required),
      time: new FormControl(this.glee.time, Validators.required),
      text: new FormControl(this.glee.text, Validators.required),
      value: new FormControl(this.glee.value, Validators.required),
      userId: new FormControl(this.glee.userId, Validators.required)
    }) : new FormGroup({
      date: new FormControl(this.glee.date, Validators.required),
      time: new FormControl(this.glee.time, Validators.required),
      text: new FormControl(this.glee.text, Validators.required),
      value: new FormControl(this.glee.value, Validators.required)
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    const date = new Date(this.gleeForm.value.date);
    const time = new Date(this.gleeForm.value.time);
    const userId = this.adminUser ? Number(this.gleeForm.value.userId) : this.glee.userId;
    const glee = new Glee();
    Object.assign(glee, {
      id: this.glee.id,
      date: date,
      time: time,
      text: String(this.gleeForm.value.text),
      value: Number(this.gleeForm.value.value),
      userId: userId,
      email: null,
    });
    if (this.index === null) {
      this.dataSource.create(glee).subscribe(
        res => {
          this.snackBar.open(`Glee on ${res.date.toLocaleDateString()} ${res.time.toLocaleTimeString()} created.`);
          this.dialogRef.close(res);
        },
        err => this.snackBar.open(`Glee creation failed due to ${formatError(err)}.`)
      );
    } else {
      this.dataSource.update(this.index, glee).subscribe(
        res => {
          this.snackBar.open(`Glee on ${glee.date.toLocaleDateString()} ${glee.time.toLocaleTimeString()} updated.`);
          this.dialogRef.close(glee);
        },
        err => this.snackBar.open(`Glee update failed due to ${formatError(err)}.`)
      );
    }
  }

}

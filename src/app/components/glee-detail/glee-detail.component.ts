import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Glee } from 'src/app/models/glee';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-glee-detail',
  templateUrl: './glee-detail.component.html',
  styleUrls: ['./glee-detail.component.scss']
})
export class GleeDetailComponent implements OnInit {

  glee: Glee;
  gleeForm: FormGroup;
  adminUser: boolean;
  users$: Observable<User[]>;

  constructor(private userService: UserService, private dialogRef: MatDialogRef<GleeDetailComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.glee = data.glee;
    this.adminUser = data.adminUser;
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
    Object.assign(this.glee, {
      date: date,
      time: time,
      text: String(this.gleeForm.value.text),
      value: Number(this.gleeForm.value.value),
      userId: userId,
      email: null,
    });
    this.dialogRef.close(this.glee);
  }

}

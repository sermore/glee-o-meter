import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { createUniqueEmailValidator } from 'src/app/helpers/unique-email.validator';
import { MatSnackBar } from '@angular/material';
import { formatError } from 'src/app/services/store-service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;

  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signinForm = new FormGroup({
      email: new FormControl('',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: createUniqueEmailValidator(this.userService, this.snackBar),
          updateOn: 'blur'
        }),
      password: new FormControl('', Validators.required),
    });
  }

  signin() {
    this.userService.signin(this.signinForm.get('email').value, this.signinForm.get('password').value)
      .subscribe(newUser => {
        console.log(`after signin ${newUser}`);
        if (newUser) {
          this.snackBar.open(`User ${newUser.email} successfully created.`);
          this.router.navigate(['/login']);
        }
      },
        err => this.snackBar.open(`User creation failed due to ${formatError(err)}.`)
      );
  }

}

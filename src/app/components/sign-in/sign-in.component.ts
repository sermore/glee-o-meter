import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { createUniqueEmailValidator } from 'src/app/helpers/unique-email.validator';
import { MatSnackBar } from '@angular/material';
import { formatError } from 'src/app/services/store-service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  signInForm: FormGroup;

  constructor(private router: Router, private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signInForm = new FormGroup({
      email: new FormControl('',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: createUniqueEmailValidator(this.userService, this.snackBar),
          updateOn: 'blur'
        }),
      password: new FormControl('', Validators.required),
    });
  }

  signIn() {
    this.userService.signin(this.signInForm.get('email').value, this.signInForm.get('password').value)
      .subscribe(newUser => {
        console.log(`after signin ${newUser}`);
        if (newUser) {
          this.router.navigate(['/login']);
        }
      },
        err => this.snackBar.open(`User creation failed due to ${formatError(err)}.`)
      );
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  private loadingSubject: BehaviorSubject<boolean>;
  loading$: Observable<boolean>;

  constructor(private authentication: AuthenticationService, private router: Router, private snackBar: MatSnackBar) {
    this.loadingSubject = new BehaviorSubject<boolean>(false);
    this.loading$ = this.loadingSubject.asObservable();
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    this.loadingSubject.next(true);
    this.authentication.login(this.loginForm.value.username, this.loginForm.value.password)
      .then(
        () => {
          this.loadingSubject.next(false);
          this.router.navigate(['/']);
        },
        error => {
          this.snackBar.open('Authentication failed.');
          this.loadingSubject.next(false);
        });
  }

}

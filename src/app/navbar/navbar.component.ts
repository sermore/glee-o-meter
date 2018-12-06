import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  loggedUser$: Observable<User>;

  constructor(private authentication: AuthenticationService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.loggedUser$ = this.authentication.loggedUser$;
    this.authentication.logout$.subscribe(msg => this.snackBar.open(msg));
  }

  logout() {
    this.authentication.logout('Session completed');
  }
}

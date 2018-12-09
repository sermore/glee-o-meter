import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { StoreServiceDataSource } from 'src/app/helpers/store-service-data-source';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { formatError } from 'src/app/services/store-service';
import { UserService, UserServiceFilter } from 'src/app/services/user.service';
import { ChangePasswordComponent } from 'src/app/shared/change-password/change-password.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[];
  dataSource: StoreServiceDataSource<User>;
  filter: UserServiceFilter;
  currentUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
  ) {
  }

  ngOnInit() {
    console.log(`users initialized ${this.authService.loggedUser.email}`);
    this.currentUser = this.authService.loggedUser;
    this.dataSource = new StoreServiceDataSource<User>(this.userService, this.snackBar);
    this.filter = new UserServiceFilter();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.displayedColumns = ['email', 'minGleePerDay', 'role', 'actions'];
  }

  private createOrEdit(i: number = null) {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      disableClose: true,
      autoFocus: true,
      minWidth: '300px',
      data: {
        index: i,
        user: i === null ? new User() : this.dataSource.data[i],
        dataSource: this.dataSource,
        currentUser: this.currentUser
      }
    });
  }

  create() {
    this.createOrEdit();
  }

  edit(i: number) {
    this.createOrEdit(i);
  }

  delete(i: number) {
    console.log(`delete ${i}`);
    this.dataSource.delete(i).subscribe(
      res => {
        if (this.dataSource.data[i].id === this.currentUser.id) {
          this.authService.logout(`Deleted current user: forced logout.`);
        } else {
          this.snackBar.open(`User deleted.`);
        }
      },
      err => this.snackBar.open(`User deletion failed due to ${formatError(err)}.`)
    );
  }

  applyFilter() {
    this.dataSource.applyFilter(this.filter);
  }

  resetFilter() {
    this.dataSource.applyFilter(null);
  }

  changePassword(i: number) {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      disableClose: true,
      autoFocus: true,
      minWidth: '300px',
      data: {
        user: this.dataSource.data[i],
        adminMode: true
      }
    });
  }
}

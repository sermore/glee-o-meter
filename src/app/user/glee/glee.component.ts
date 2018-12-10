import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreServiceDataSource } from 'src/app/helpers/store-service-data-source';
import { Glee } from 'src/app/models/glee';
import { Role, User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GleeService, GleeServiceFilter } from 'src/app/services/glee.service';
import { UserService } from 'src/app/services/user.service';
import { GleeDetailComponent } from '../glee-detail/glee-detail.component';

@Component({
  selector: 'app-glee',
  templateUrl: './glee.component.html',
  styleUrls: ['./glee.component.scss']
})
export class GleeComponent implements OnInit {
  displayedColumns: string[];
  dataSource: StoreServiceDataSource<Glee>;
  adminUser: boolean;
  filter: GleeServiceFilter;
  users$: Observable<User[]>;
  private currentUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private gleeService: GleeService,
    private userService: UserService,
    private authService: AuthenticationService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    console.log(`glee initialized ${this.authService.loggedUser.email}`);
    this.currentUser = this.authService.loggedUser;
    this.adminUser = this.currentUser.role !== Role.USER;
    this.dataSource = new StoreServiceDataSource<Glee>(this.gleeService, this.snackBar);
    this.filter = new GleeServiceFilter();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.displayedColumns = this.adminUser ? ['email', 'date', 'time', 'text', 'value', 'actions']
      : ['date', 'time', 'text', 'value', 'actions'];
    this.users$ = this.userService.load(null, null).pipe(map(result => result.data));
  }

  private createOrEdit(i: number = null) {
    console.log(this.currentUser);
    const dialogRef = this.dialog.open(GleeDetailComponent, {
      disableClose: true,
      autoFocus: true,
      minWidth: '300px',
      data: {
        index: i,
        glee: i === null ? new Glee({ user: { id: this.currentUser.id, email: null } }) : this.dataSource.data[i],
        dataSource: this.dataSource,
        adminUser: this.adminUser
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
    this.dataSource.delete(i).subscribe(res => this.snackBar.open(`Glee deleted.`));
  }

  applyFilter() {
    this.dataSource.applyFilter(this.filter);
  }

  resetFilter() {
    this.dataSource.applyFilter(null);
  }

  valueUnder(value: number): boolean {
    return value < this.currentUser.minGleePerDay;
  }
}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatExpansionModule,
  MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule, MatPaginatorModule,
  MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatToolbarModule, MatProgressSpinnerModule
} from '@angular/material';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    ChangePasswordComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    MatSnackBarModule,
    OwlDateTimeModule, OwlNativeDateTimeModule,
    MatProgressSpinnerModule,
    ChangePasswordComponent
  ]
})
export class SharedModule { }

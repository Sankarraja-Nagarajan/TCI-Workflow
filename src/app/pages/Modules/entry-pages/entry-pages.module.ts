import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { GateEntryComponent } from './gate-entry/gate-entry.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { ApprovalComponent } from './approval/approval.component'
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxSpinnerModule } from "ngx-spinner";
import { AuthGuard } from '../../../Guards/auth.guard';
import { TrackingDialogComponent } from './tracking-dialog/tracking-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

const routes : Routes = [
  {
    path : 'dashboard',
    component : DashboardComponent,
    canActivate : [AuthGuard]
  },
  {
    path : 'gate-entry',
    component : GateEntryComponent,
    canActivate : [AuthGuard]
  },
  {
    path : 'approval',
    component : ApprovalComponent,
    canActivate : [AuthGuard]
  },
  {
    path : 'tracking-dialog',
    component : TrackingDialogComponent
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    GateEntryComponent,
    ApprovalComponent,
    TrackingDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    ChartsModule,
    MatNativeDateModule,
    MatCardModule,
    MatSnackBarModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    MatDialogModule,
  ],
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class EntryPagesModule { }

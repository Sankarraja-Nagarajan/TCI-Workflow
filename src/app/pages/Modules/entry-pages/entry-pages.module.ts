import { NgModule } from '@angular/core';
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

const routes : Routes = [
  {
    path : 'dashboard',
    component : DashboardComponent
  },
  {
    path : 'gate-entry',
    component : GateEntryComponent
  },
  {
    path : 'approval',
    component : ApprovalComponent
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    GateEntryComponent,
    ApprovalComponent
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
    MatCardModule
  ]
})
export class EntryPagesModule { }

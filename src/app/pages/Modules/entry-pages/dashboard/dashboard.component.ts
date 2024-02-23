import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { ChartType } from "chart.js";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LoginService } from '../../../Services/login.service';
import { GateEntryService } from '../../../Services/gate-entry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardTable } from '../../../Models/dashboardTable';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/notification-snackbar';
import { FileSaverService } from '../../../Services/file-saver.service';
import { CommonSpinnerService } from '../../../Services/common-spinner.service';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class DashboardComponent {
    
@ViewChild(MatPaginator) paginator : MatPaginator;
userDetails : any;
displayedColumns : any[] = [];
dataSource = new MatTableDataSource();
GateEntryDetails : any [] = [];
dashboardTable = new DashboardTable();
activeCard : number = 0;

selection = new SelectionModel<any>(true, []);


constructor(private router : Router, 
            private _loginService : LoginService, 
            private _gateEntryService : GateEntryService, 
            public snackBar: MatSnackBar, 
            private _commonService : CommonService, 
            private _commonSpinner : CommonSpinnerService,  
            private _fileSaver : FileSaverService){

    this.userDetails = _loginService.decryptToken(localStorage.getItem('TciToken'));

    if(this.userDetails.Role == 'I')
    {
        this.displayedColumns = [
            'GATE_ENTRY_NO',
            'PLANT',
            'GATE_ENTRY_DATE',
            'INVOICE_NO',
            'INVOICE_DATE',
            'RECEIVED_DATE',
            'REVIEW'
        ]
    }
    else
    {
        this.displayedColumns = [
            'GATE_ENTRY_NO',
            'PLANT',
            'GATE_ENTRY_DATE',
            'INVOICE_NO',
            'INVOICE_DATE',
            'RECEIVED_DATE',
            'STATUS'
        ]
    }

}
/** Constructor End */

ngOnInit(): void {
  this.CardClicked(1);
  this.getGateEntry();
}

/** Get the Gate Entry Details Based on the Selected Cards Status */
selectedCard(status)
{
  if(status == "All")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.allGateEntry);
  }
  if(status == "Pending")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.pendingGateEntry);
  }
  if(status == "Approve")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.approvedGateEntry);
  }
  if(status == "Reject")
  {
    this.dataSource = new MatTableDataSource(this.dashboardTable.rejectedGateEntry);
  }
  this.dataSource.paginator = this.paginator;
}

/** Get Method for Gate Entry Details */
getGateEntry()
{
    this._gateEntryService.getGateEntryDetails(this.userDetails.Role, this.userDetails.UserId).subscribe({
        next : (response) => 
        {
            this.GateEntryDetails = response;
            if(this.GateEntryDetails.length > 0)
            {
                this.dataSource = new MatTableDataSource(this.GateEntryDetails);
                this.dataSource.paginator = this.paginator;
                this.getCount(this.GateEntryDetails);
            }
        },error : (err) => {
          // this._loginService.showToast(err.error.Message, "danger", "bottom-end");
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        },
    })
}

/** Click Method for Gate Entry Status in Cards */
CardClicked(cardnumber : number) : void
{
  this.activeCard = cardnumber;
}

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
  
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

/** Export to Excel as Gate Entry Details */
download() : void
{
  if(this.GateEntryDetails.length > 0)
  {

    this._commonSpinner.showSpinner();
    var selectedTrackingNo : number [] = [];
    this.GateEntryDetails.forEach(element => {
      selectedTrackingNo.push(element.gateEntryNo); 
    });

    // this._spinner.show();
    this._gateEntryService.downloadExcel(selectedTrackingNo).subscribe({
      next : async (response) => 
      {
        this._commonSpinner.hideSpinner();
        await this._fileSaver.downloadFile(response);
        this._commonService.openSnackbar("Downloaded Successfully", snackbarStatus.Success);
      },error : (err) => {
        this._commonSpinner.hideSpinner();
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
    
    this.CardClicked(1);

    this.dataSource = new MatTableDataSource(this.GateEntryDetails);
    this.dataSource.paginator = this.paginator;

  }
  else
  {
    this._commonService.openSnackbar("No Gate Entry has Created", snackbarStatus.Danger);
    
  }
}

/** Redirect to the Approval Page */
approve(gateEntryNo) : void
{
    this.router.navigate(['pages/entry-pages/approval'], {queryParams : { GateEntryNo : gateEntryNo }});
}

/** Get All, Active, Pending, Approved, Rajected Count */
getCount(tableData) : void
{
    this.dashboardTable.allGateEntry = tableData;
    tableData.forEach(element => {
        if(element.status == "Pending")
        {
            this.dashboardTable.pendingGateEntry.push(element);
        }
        else if(element.status == "Approved")
        {
            this.dashboardTable.approvedGateEntry.push(element);
        }
        else if(element.status == "Rejected")
        {
            this.dashboardTable.rejectedGateEntry.push(element);
        }
    });
}

}


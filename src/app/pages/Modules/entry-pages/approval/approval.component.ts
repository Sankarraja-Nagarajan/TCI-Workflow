import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GateEntryService } from '../../../Services/gate-entry.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../Services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileSaverService } from '../../../Services/file-saver.service';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/notification-snackbar';

@Component({
  selector: 'ngx-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent {

  displayedColumns: string[] = ['trnid-col', 'se-col', 'itemcode-col', 'desc-col', 'poqty-col', 'security-col'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  rejectionFormGroup : FormGroup;
  gateEntryNo : any;
  userDetails : any;
  gateEntries : any = {};
  gateEntryMaterials : any[] = [];
  activeStepper : any[] = [];
  showReasonAndSubit : boolean = false;
  showApproveOrReject : boolean = true;
  showApproveContainer : boolean = true;
  rejection = ['Poor Quality', 'Quantity Mismatch', 'Price Mismatch', 'Material Mismatch', 'If Others, (Kindly provide the reason in commments)', 'Security Mismatch'];

  constructor(private _gateEntryService : GateEntryService, 
              public snackBar: MatSnackBar, 
              private _router : Router, 
              private _loginService : LoginService,
              private _fb : FormBuilder, 
              private _spinner: NgxSpinnerService, 
              private _activatedRoute : ActivatedRoute, 
              private _fileSaver : FileSaverService, 
              private _commonService : CommonService)
  {
    
  }

  ngOnInit()
  {

    this.rejectionFormGroup = this._fb.group({
      ResonForRejection : ['', Validators.required],
      Comments : ['', Validators.required],
    })



    this._activatedRoute.queryParams.subscribe({
      next : (data) =>
      {
        this.gateEntryNo = data.GateEntryNo;
      }
    })


    if(this.gateEntryNo)
    {
      this.userDetails = this._loginService.decryptToken(localStorage.getItem('TciToken'));

      if(this.userDetails.Role == "I")
      {
        this.showApproveContainer = false;
      }

      this._gateEntryService.getGateEntryApprove(this.gateEntryNo).subscribe({
        next : (response) => 
        {
          this.gateEntries = response.gateEntry;
          this.gateEntryMaterials = response.gateEntryMaterials;
          this.dataSource = new MatTableDataSource(this.gateEntryMaterials);
          this.dataSource.paginator = this.paginator;
        }
      })
    }
    else
    {
      this._router.navigate(['/pages/entry-pages/dashboard']);
    }

    this.getStepperUser();

  }

  downloadAttachment()
  {
    //this._spinner.show();
    this._gateEntryService.GetApprovalDocument(this.gateEntryNo).subscribe({
      next : async (response) => 
      {
        var data = {
          FileName : '', 
          FileContent : '', 
          FileType : '',
          FileSize : '',
          GateEntryNo : '',
          Id : '',
        }
        data.FileContent = response.fileContent;
        data.FileName = response.fileName;
        data.FileType = response.fileType;
        data.FileSize = response.fileSize;
        data.GateEntryNo = response.gateEntryNo;
        data.Id = response.id;
        await this._fileSaver.downloadFile(data);
        //this._spinner.hide();
      }
    })
  }

  approve()
  {
    this._spinner.show();
    this._gateEntryService.approvePO(this.gateEntryNo, this.userDetails.UserId).subscribe({
      next : (response) => 
      {
        this._spinner.hide();
        this._commonService.openSnackbar(response.message, snackbarStatus.Success);
        localStorage.removeItem('GateEntryNo');
        this._router.navigate(['/pages/entry-pages/dashboard']);
      },error : (err) => {
        this._spinner.hide();
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }

  reject()
  {
    this.showReasonAndSubit = true;
    this.showApproveOrReject = false;
  }

  cancel()
  {
    this.showReasonAndSubit = false;
    this.showApproveOrReject = true;
  }

  submitReject()
  {
    if(this.rejectionFormGroup.valid)
    {
      this._spinner.show();
      this._gateEntryService.rejectGateEntry(this.gateEntryNo, this.userDetails.UserId, this.rejectionFormGroup.value.ResonForRejection, this.rejectionFormGroup.value.Comments).subscribe({
      next : (response) => 
      {
        this._spinner.hide();
        this._commonService.openSnackbar(response.message, snackbarStatus.Success);
        this._router.navigate(['/pages/entry-pages/dashboard']);
      },error : (err) => {
        this._spinner.hide();
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
      })
    }
    else
    {
      this._commonService.openSnackbar("Please Select Reason for Rejection/ Kindly Provide Reason in Comments", snackbarStatus.Danger);
    }
  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition : 'bottom',
      horizontalPosition : 'end',
      panelClass: [className]
    });
  }

  getStepperUser()
  {
    this._gateEntryService.getApproveUserDetails(this.gateEntryNo).subscribe({
      next : (response) => 
      {
        this.activeStepper = response;
        this.checkUserStatus(response);
      }
    })
  }


  checkUserStatus(data)
  {
    data.forEach(element => {
      if(element.owner == this.userDetails.UserId)
      {
        if(element.status == "Approved" || element.status == "Rejected")
        {
          this.showApproveContainer = false;
        }
      }
    });
  }

}

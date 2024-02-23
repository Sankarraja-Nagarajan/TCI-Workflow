import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GateEntryService } from '../../../Services/gate-entry.service';
import { LoginService } from '../../../Services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { gateEntryDto } from '../../../Models/gateEntry';
import { CommonService } from '../../../Services/common.service';
import { snackbarStatus } from '../../../Enums/notification-snackbar';
import { CommonSpinnerService } from '../../../Services/common-spinner.service';
import { TrackingDialogComponent } from '../tracking-dialog/tracking-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ngx-gate-entry',
  templateUrl: './gate-entry.component.html',
  styleUrls: ['./gate-entry.component.scss'],
  encapsulation : ViewEncapsulation.None
})
export class GateEntryComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  displayedColumns = ['partsno-col', 'itemno-col', 'desc-col', 'value-col', 'poqty-col', 'opengrqty-col', 'secqty-col', 'packno-col'];
  gateEntryForm : FormGroup;
  OpenQuantityFormGroup : FormGroup;
  tableData : any[] = [];
  gateEntry = {
    gateEntryNo : '',
    gateEntryDate : '',
    gateEntryTime : ''
  }
  todayDate:Date = new Date();
  token : any;
  userDetails : any;
  userId : string;
  files : any;

  constructor(private _fb : FormBuilder,
              private _gateEntryService : GateEntryService, 
              private _loginService : LoginService, 
              public snackBar: MatSnackBar, 
              public datepipe: DatePipe, 
              private _router : Router, 
              private _datePipe : DatePipe, 
              private _commonSpinner : CommonSpinnerService,  
              private _commonService : CommonService, 
              public _dialog: MatDialog) { 

    
    this.token = localStorage.getItem('TciToken');
    this.userDetails = _loginService.decryptToken(this.token);
    this.userId = this.userDetails.UserId;

    this.gateEntryForm = _fb.group({
      Id : 0,
      gateEntryNo : '',
      Plant : ['', Validators.required],
      gateEntryDate : '',
      gateEntryTime : '',
      PurchasingDocument : ['', Validators.required],
      PurchasingDocumentDate : '',
      invoiceNo : ['', Validators.required],
      invoiceDate : ['', Validators.required],
      vendorCode : '',
      vendorName : '',
      vehicleNo : '',
      lrNo : '',
      receivedDate : '',
      costCenter : '',
      remarks : '',
      localOrImport : 'Local',
      external : false,
    })
    
    this.OpenQuantityFormGroup = _fb.group({
      items : _fb.array([])
    })

  }
  /** Constructor End */

  ngOnInit()
  {
    this.getGateEntries();
  }

  /** Get Gate Entry No , Date, Time */
  getGateEntries()
  {

    // Gate Entry Date and Time
    this._gateEntryService.getGateEnrtyNo().subscribe({
      next : (response) => 
      {
        this.gateEntry.gateEntryNo = response;
        this.gateEntry.gateEntryDate = this.datepipe.transform(new Date().toLocaleDateString(), 'MM/dd/yyyy'),
        this.gateEntry.gateEntryTime = new Date().toLocaleTimeString(),
        this.gateEntryForm.patchValue(this.gateEntry);
      }, error : (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })

  }

  /** Search Method based on PO Number */
  searchPo()
  {
    var poNumber = this.gateEntryForm.value.PurchasingDocument;
    if(poNumber.trim() != "")
    {

      this._gateEntryService.getDetailsByPo(poNumber).subscribe({
        next : (response) => 
        {
          if(response.message)
          {
            var emptyPoDetails = {
              PurchasingDocumentDate : '',
              invoiceNo : '',
              invoiceDate : '',
              vendorCode : '',
              vendorName : '',
              vehicleNo : '',
              lrNo : '',
              receivedDate : '',
              costCenter : '',
              remarks : '',
            };
            this.gateEntryForm.patchValue(emptyPoDetails);
            this._commonService.openSnackbar(response.message, snackbarStatus.Success);
          }
          if(!response.message)
          {
            var poDetails = response;
            response.invoiceNo = '';
            poDetails.receivedDate = this.datepipe.transform(new Date().toLocaleDateString(), 'MM/dd/yyyy');
            poDetails.PurchasingDocumentDate = this.changeDate(poDetails.purchasingDocumentDate);
            poDetails.invoiceDate = this.changeDate(poDetails.invoiceDate);
            this.gateEntryForm.patchValue(response);
          }
        },error : (err) => {
          this._commonService.openSnackbar(err, snackbarStatus.Danger);
        },
      })


      
      this.getMaterialDetailsByPo(poNumber);
    }
  }


  getMaterialDetailsByPo(poNumber)
  {
    this._gateEntryService.getMaterialDetails(poNumber).subscribe({
      next : (data) => 
      {
        if(data)
        {
          this.tableData = data;

          this.tableData.forEach(element => {

            var re = /,/gi;
            let removeCommas = element.poQty.toString().replace(re,"");
            let convertNumber = parseInt(removeCommas, 10);
            element.poQty = convertNumber;

            const addRow = this.OpenQuantityFormGroup.get('items') as FormArray;
            var obj  = this.getFormFields();
            addRow.push(obj);
            // element.security = obj.value;
          });

          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.paginator = this.paginator;
        }
      },error : (err) => {
        this._commonService.openSnackbar(err, snackbarStatus.Danger);
      },
    })
  }


  /** Form Fields Method */
  getFormFields()
  {
    return this._fb.group({
      securityQty : '',
    })
  }

  /** Cancel Method */
  cancel()
  {
    this._router.navigate(['/pages/entry-pages/dashboard']);
  }

  /** File Upload */
  onUploadFileChange(event)
  {
    const fileSizeLimit = 10 * 1024 * 1024; // 10 MB in bytes
    const file = event.target.files.item(0);
    if(file && file.size <= fileSizeLimit)
    {
      this.files = file;
      this._commonService.openSnackbar("Uploaded Successfully", snackbarStatus.Success);
    }
    else
    {
      this._commonService.openSnackbar("File size should less than or equal 10 MB", snackbarStatus.Warning);
    }
  }

  /** Save Gate Entry */
  save()
  {

    var errCount = 0;
    var securityQtyCount = 0;
    var zeroSecurityQty = 0;

    this.tableData.forEach((element, index) => {
      element.securityQty = this.OpenQuantityFormGroup.get('items').value[index].securityQty;
    });

    
    this.tableData.forEach((element, index) => {
      if(this.OpenQuantityFormGroup.controls.items.value[index].securityQty != null && this.OpenQuantityFormGroup.controls.items.value[index].securityQty != "")
      {
        if(this.OpenQuantityFormGroup.controls.items.value[index].securityQty == 0)
        {
          zeroSecurityQty++;
        }
        securityQtyCount++;
          if(element.openGrQty != null)
          {
            if(!(Number(element.openGrQty) >= Number(this.OpenQuantityFormGroup.controls.items.value[index].securityQty)))
            {
              errCount++;
              this._commonService.openSnackbar("Item No : " + element.item + "  " + "(Po Quantity Mismatch)", snackbarStatus.Danger);
            }
          }
          else
          {
            if(!(Number(element.poQty) >= Number(this.OpenQuantityFormGroup.controls.items.value[index].securityQty)))
            {
              errCount++;
              this._commonService.openSnackbar("Item No : " + element.item + "  " + "(Po Quantity Mismatch)", snackbarStatus.Danger);
            }
          }
        }
    });

    //this.dataSource = new MatTableDataSource(this.tableData);
    //this.dataSource.paginator = this.paginator;


    if(this.gateEntryForm.valid)
    {
      if(this.gateEntryForm.value.Plant == "8938")
      {
        if(this.gateEntryForm.value.costCenter.trim() != "")
        {
          if(securityQtyCount != 0)
          {
            if(errCount == 0)
            {

              if(zeroSecurityQty == 0)
              {

                if(this.files)
                {
                  this._commonSpinner.showSpinner();


                  this.OpenQuantityFormGroup.controls.items.value.forEach((element, index) => {

                    if(element.securityQty != null && element.securityQty != "")
                    {
                      if(this.tableData[index].openGrQty != null)
                      {
                          this.tableData[index].openGrQty = Number(this.tableData[index].openGrQty) - Number(element.securityQty);
                      }
                      else
                      {
                          this.tableData[index].openGrQty = Number(this.tableData[index].poQty) - Number(element.securityQty);
                      }
                    }


                  });


                  this.gateEntryForm.value.gateEntryDate = new Date(this.gateEntryForm.value.gateEntryDate);
                  this.gateEntryForm.value.gateEntryDate = this._datePipe.transform(this.gateEntryForm.value.gateEntryDate, 'yyyy-MM-dd');
                  this.gateEntryForm.value.PurchasingDocumentDate = new Date(this.gateEntryForm.value.PurchasingDocumentDate);
                  this.gateEntryForm.value.invoiceDate = this._datePipe.transform(this.gateEntryForm.value.invoiceDate, 'yyyy-MM-dd');
                  this.gateEntryForm.value.receivedDate = new Date(this.gateEntryForm.value.receivedDate);
                  this.gateEntryForm.value.receivedDate = this._datePipe.transform(this.gateEntryForm.value.receivedDate, 'yyyy-MM-dd');
                  var gateEntries = new gateEntryDto();
                  gateEntries.Status = "Pending";
                  gateEntries.UserId = this.userDetails.UserId;
                  gateEntries.gateEntry = this.gateEntryForm.value;
                  gateEntries.gateEntry.PurchasingDocumentDate = this.gateEntryForm.value.PurchasingDocumentDate;
                  this.tableData.forEach(element => {
                    if(element.securityQty != null && element.securityQty != "")
                    {
                      element.PurchasingDocument = this.gateEntryForm.value.PurchasingDocument;
                      gateEntries.gateEntryMaterials.push(element);
                    }
                  });

                  const formData = new FormData();
                  formData.append("gateEntryDto", JSON.stringify(gateEntries));
                  formData.append(this.files.name, this.files, this.files.name);

                  this._gateEntryService.saveGateEntry(formData).then(
                    (response) => 
                    {

                      this._commonSpinner.hideSpinner();
                      this._router.navigate(['/pages/entry-pages/dashboard']).then(() => 
                      {
                        this._commonService.openSnackbar(response.message, snackbarStatus.Success);
                      });
                    }
                  ).catch((err) => 
                  {
                    this._commonSpinner.hideSpinner();
                    this.getMaterialDetailsByPo(this.gateEntryForm.value.PurchasingDocument);
                    if(err == "Gate Entry No already exists")
                    {
                      this.addGateEntryNo();
                    }
                    else
                    {
                      this._commonService.openSnackbar(err, snackbarStatus.Danger);
                    }
                  })
                }
                else
                {
                  this._commonService.openSnackbar("Attachment is Mandatory", snackbarStatus.Danger);
                }
              }
              else
              {
                this._commonService.openSnackbar("Security Quantity should be greater than Zero", snackbarStatus.Danger);
              }
            }
          }
          else
          {
            this._commonService.openSnackbar("Fill Security Quantity", snackbarStatus.Danger);
          }
        }
        else
        {
          this._commonService.openSnackbar("Cost Center Not Allocated", snackbarStatus.Danger);
        }
      }
      else
      {
        this._commonService.openSnackbar("Please use only plant 8938", snackbarStatus.Danger);
      }
    }
    else
    {
      if(this.gateEntryForm.controls.Plant.invalid && this.gateEntryForm.controls.PurchasingDocument.invalid && this.gateEntryForm.controls.invoiceNo.invalid && this.gateEntryForm.controls.invoiceDate.invalid)
      {
        this._commonService.openSnackbar("Enter Valid Details", snackbarStatus.Danger);
      }
      else if(this.gateEntryForm.controls.PurchasingDocument.invalid)
      {
        this._commonService.openSnackbar("Enter Purchasing Document No", snackbarStatus.Danger);
      }
      else if(this.gateEntryForm.controls.Plant.invalid)
      {
        this._commonService.openSnackbar("Enter Plant", snackbarStatus.Danger);
      }
      else if(this.gateEntryForm.controls.invoiceNo.invalid)
      {
        this._commonService.openSnackbar("Enter Invoice No", snackbarStatus.Danger);
      }
      else if(this.gateEntryForm.controls.invoiceDate.invalid)
      {
        this._commonService.openSnackbar("Enter Invoice Date", snackbarStatus.Danger);
      }
    }

  }

  /** Change Date Format Method */
  changeDate(date)
  {
    var changeDate = this.datepipe.transform(date, 'MM/dd/yyyy');
    return changeDate;
  }


  /** Add Tracking No Dialog */
  addGateEntryNo()
  {
    const dialogRef = this._dialog.open(TrackingDialogComponent, {
      disableClose: true,
      backdropClass: 'userActivationDialog',
    }).afterClosed().subscribe((res) => {
      if(res == "Add")
      {
        this.getGateEntries();
      }
    });
  }
  
}
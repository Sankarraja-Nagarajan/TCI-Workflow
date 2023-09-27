import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

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
  tableData : any[] = [];

  constructor(private _fb : FormBuilder) { 
    
    this.gateEntryForm = _fb.group({
      gateEntryNo : '',
      Plant : ['', Validators.required],
      gateEntryDate : '',
      gateEntryTime : '',
      poNumber : ['', Validators.required],
      poDate : '',
      invoiceNo : ['', Validators.required],
      invoiceDate : '',
      vendorCode : '',
      vendorName : '',
      vehicleNo : '',
      lrNo : '',
      receivedDate : '',
      costCenter : '',
      remarks : '',
    })
    

    // Gate Entry Date and Time
    var gateEntry = {
      gateEntryNo : 1,
      gateEntryDate : new Date().toLocaleDateString(),
      gateEntryTime : new Date().toLocaleTimeString(),
    }
    this.gateEntryForm.patchValue(gateEntry);


    // PO Number Value Changes
    this.gateEntryForm.get('poNumber').valueChanges.subscribe({
      next : (response) =>
      {
        if(response == 123)
        {
          var result = {
          poDate : '09/12/2022',
          invoiceNo : '122',
          invoiceDate : '09/12/2022',
          vendorCode : '123',
          vendorName : 'ABC',
          vehicleNo : '123',
          lrNo : '12345',
          receivedDate : '09/12/2022',
          costCenter : '123',
          remarks : 'Nothing',
        }
          this.gateEntryForm.patchValue(result);

          this.tableData = [
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
            {partsNo : 1, itemNo : 1, description : "Lenovo", value : 10000, poQty : 2, openGRqty : 3, securityQty : 4, packNo : 1},
          ];

          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.paginator = this.paginator;
        }
        else
        {
          var result = {
            poDate : '',
            invoiceNo : '',
            invoiceDate : '',
            vendorCode : '',
            vendorName : '',
            vehicleNo : '',
            lrNo : '',
            receivedDate : '',
            costCenter : '',
            remarks : '',
          }
          this.gateEntryForm.patchValue(result);

          this.tableData = [];

          this.dataSource = new MatTableDataSource(this.tableData);
          this.dataSource.paginator = this.paginator;
        }
      }
    })


  }

  save()
  {
    console.log(this.gateEntryForm.value);
  }

}
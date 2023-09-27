import { Component, ViewChild } from '@angular/core';
import { ChartType } from "chart.js";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
    
    @ViewChild(MatPaginator) paginator : MatPaginator;
    UserName : any;
    displayedColumns : any[] = [];


  // Donut Chart
  public doughnutChartLabels : any[] = ['BU Rep', 'BU Head', 'Controller'];
  public doughnutChartData: any[] = [1,1,2];
  public doughnutChartType : ChartType = 'doughnut';
  public colors: any[] = [{ backgroundColor: ["#52de97", '#4452c6', "#fb7800"] }];
  public doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        position: "right",
        labels: {
            fontSize: 12,

            render: 'percentage',
            padding: 20,
            usePointStyle: true,
        },
    },
    cutoutPercentage: 60,
    elements: {
        arc: {
            borderWidth: 0,
        },
    },
    plugins: {
        labels: {
            render: function (args) {
                return args.value + "\n(" + args.percentage + "%" + ")";
            },
            fontColor: "#000",
            position: "default",

            // outsidePadding: 0,
            // textMargin: 0
        },
    },
};

public doughnutChartLabels1 : any[] = ['Success rate', 'Pending Data'];
public doughnutChartData1: any[] = [1,1];
public doughnutChartType1 : ChartType = 'doughnut';
public colors1: any[] = [{ backgroundColor: ["#79fa46", '#f73025'] }];
public doughnutChartOptions1 = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
      position: "right",
      labels: {
          fontSize: 13,
          render: 'percentage',
          padding: 30,
          usePointStyle: true,
      },
  },
  cutoutPercentage: 80,
  elements: {
      arc: {
          borderWidth: 0,
      },
  },
  plugins: {
      labels: {
          render: function (args) {
              return args.value + "\n(" + args.percentage + "%" + ")";
          },
          fontColor: "#000",
          position: "default",

          // outsidePadding: 0,
          // textMargin: 0
      },
  },
};

constructor(private router : Router){

    this.UserName = localStorage.getItem('UserName');

    if(this.UserName == 'User')
    {
        this.displayedColumns = [
            'GATE_ENTRY_NO',
            'PLANT',
            'GATE_ENTRY_DATE',
            'INVOICE_NO',
            'INVOICE_DATE',
            'RECEIVED_DATE',
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



GateEntryDetails = [
    {GATE_ENTRY_NO:8938,PLANT:'8938',GATE_ENTRY_DATE:'28/09/2022', INVOICE_NO:'2236/112/22-23',INVOICE_DATE:'01/09/2022', PO_DATE:'10/09/2022', RECEIVED_DATE:'29/09/2022'},
    {GATE_ENTRY_NO:8938,PLANT:'8937',GATE_ENTRY_DATE:'27/09/2022', INVOICE_NO:'2235/112/22-23',INVOICE_DATE:'02/09/2022', PO_DATE:'11/09/2022', RECEIVED_DATE:'28/09/2022'},
    {GATE_ENTRY_NO:3875,PLANT:'0936',GATE_ENTRY_DATE:'28/09/2022', INVOICE_NO:'2234/112/22-23',INVOICE_DATE:'03/09/2022', PO_DATE:'12/09/2022', RECEIVED_DATE:'27/09/2022'},    
    {GATE_ENTRY_NO:3874,PLANT:'0935',GATE_ENTRY_DATE:'25/09/2022', INVOICE_NO:'2233/112/22-23',INVOICE_DATE:'04/09/2022', PO_DATE:'13/09/2022', RECEIVED_DATE:'25/09/2022'},
    {GATE_ENTRY_NO:3872,PLANT:'0933',GATE_ENTRY_DATE:'26/09/2022', INVOICE_NO:'2232/112/22-23',INVOICE_DATE:'05/09/2022', PO_DATE:'14/09/2022', RECEIVED_DATE:'24/09/2022'},
    {GATE_ENTRY_NO:3871,PLANT:'0932',GATE_ENTRY_DATE:'24/09/2022', INVOICE_NO:'2231/112/22-23',INVOICE_DATE:'06/09/2022', PO_DATE:'15/09/2022', RECEIVED_DATE:'23/09/2022'},
    {GATE_ENTRY_NO:3870,PLANT:'0931',GATE_ENTRY_DATE:'23/09/2022', INVOICE_NO:'2239/112/22-23',INVOICE_DATE:'07/09/2022', PO_DATE:'16/09/2022', RECEIVED_DATE:'22/09/2022'},
    {GATE_ENTRY_NO:3877,PLANT:'0930',GATE_ENTRY_DATE:'22/09/2022', INVOICE_NO:'2237/112/22-23',INVOICE_DATE:'08/09/2022', PO_DATE:'17/09/2022', RECEIVED_DATE:'21/09/2022'}
];

dataSource = new MatTableDataSource(this.GateEntryDetails);

    ngAfterViewInit(){
        this.dataSource.paginator = this.paginator;
    }

ngOnInit(): void {

    // Search Filter for Gate Entry No, Plant, Invoice No
    this.dataSource.filterPredicate = function (GateEntryDetails,filter) {
      return GateEntryDetails.GATE_ENTRY_NO.toString().includes(filter) || GateEntryDetails.PLANT.toString().includes(filter) || GateEntryDetails.INVOICE_NO.toString().includes(filter);
    }
}


// Search Filter for Gate Entry No, Plant, Invoice No
applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
}
}


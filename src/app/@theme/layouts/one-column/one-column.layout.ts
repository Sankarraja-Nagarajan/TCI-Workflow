import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed *ngIf="hideHeader">
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-layout-column [ngClass]="{'content-padding' : hideHeader === false}">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed *ngIf="hideHeader">
        <ngx-footer></ngx-footer>
      </nb-layout-footer>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {

  hideHeader : boolean;

  constructor(private _router:Router) {

    this._router.events.subscribe({
      next : (response) => 
      {
        // console.log("Navigation End : ", response instanceof NavigationEnd);
        if(response instanceof NavigationEnd)
        {
          if(response.urlAfterRedirects.includes('/login'))
          {
            this.hideHeader = false;
          }
          else
          {
            this.hideHeader = true;
          }
        }
      }
    })
  }
  
}



// <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
// <ng-content select="nb-menu"></ng-content>
// </nb-sidebar>
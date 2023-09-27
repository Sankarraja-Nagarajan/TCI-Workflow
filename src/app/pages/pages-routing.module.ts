import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { AuthenticationModule } from './Modules/authentication/authentication.module';
import { EntryPagesModule } from './Modules/entry-pages/entry-pages.module';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path : 'authentication',
      loadChildren : () => import('./Modules/authentication/authentication.module').then(auth => AuthenticationModule)
    },
    {
      path : 'entry-pages',
      loadChildren : () => import('./Modules/entry-pages/entry-pages.module').then(entry => EntryPagesModule)
    },
    {
      path: '',
      redirectTo: 'authentication',
      pathMatch: 'full',
    },
    // {
    //   path: '**',
    //   component: ,
    // },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

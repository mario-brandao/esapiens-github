import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_CONSTANTS } from './app.constants';

const routes: Routes = [
  {
    path: `${APP_CONSTANTS.USER_ROUTE}`,
    loadChildren: () => import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

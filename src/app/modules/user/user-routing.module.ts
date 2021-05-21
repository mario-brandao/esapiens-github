import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { RepositoryDetailsComponent } from './repository-details/repository-details.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
  },
  {
    path: ':login',
    component: UserComponent,
  },
  {
    path: `:login/${APP_CONSTANTS.REPO_ROUTE}/:name`,
    component: RepositoryDetailsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }

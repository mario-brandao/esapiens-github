import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RepositoriesComponent } from './repositories/repositories.component';
import { RepositoryDetailsComponent } from './repository-details/repository-details.component';
import { TagComponent } from './tag/tag.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';



@NgModule({
  declarations: [
    UserComponent,
    TagComponent,
    RepositoriesComponent,
    RepositoryDetailsComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    RouterModule,
    SharedModule
  ]
})
export class UserModule { }

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { Repository } from 'src/app/interfaces/repository';
import { User } from 'src/app/interfaces/user';
import { GitHubService } from 'src/app/services/github/github.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  userLoginParam: string;

  user: User;
  loading: boolean;
  loadingError: boolean;
  repos: Repository[];

  subscriptions: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gitHubService: GitHubService,
    private toastr: ToastrService,
  ) {
    this.subscriptions = new Subscription();
    this.getUserLoginParam();
  }

  ngOnInit(): void {
    this.getUser();
    this.watchRouteChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUserLoginParam(): void {
    this.userLoginParam = this.activatedRoute.snapshot.paramMap.get('login');
  }

  watchRouteChanges(): void {
    this.router.events.subscribe((event: any) => {
      if (
        event instanceof NavigationEnd &&
        !event.urlAfterRedirects.includes(APP_CONSTANTS.REPO_ROUTE)
      ) {
        this.getUserLoginParam();
        this.getUser();
      }
    });
  }

  getUser(): void {
    this.loading = true;
    this.loadingError = false;

    const userObs = this.gitHubService.getUser(this.userLoginParam).subscribe((user: User) => {
      this.user = user;
    }, (error) => {
      this.toastr.error(error.message);
      this.loadingError = true;
    }, () => {
      this.loading = false;
    });
    this.subscriptions.add(userObs);
  }

}

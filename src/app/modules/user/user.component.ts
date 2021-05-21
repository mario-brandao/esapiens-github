import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
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
    this.get();
    this.watchRouteChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getUserLoginParam(): void {
    this.userLoginParam = this.activatedRoute.snapshot.paramMap.get('login');
  }

  get(): void {
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

  watchRouteChanges(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.getUserLoginParam();
        this.get();
      }
    });
  }

}

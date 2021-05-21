import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { Repository } from 'src/app/interfaces/repository';
import { GitHubService } from 'src/app/services/github/github.service';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.scss']
})
export class RepositoriesComponent implements AfterViewInit, OnDestroy {

  @Input() repos: Repository[];
  @Input() user: string;

  loadingRepos: boolean;
  loadingReposError: boolean;
  repoDetails: string;

  isSortingDesc: boolean;

  subscriptions: Subscription;

  constructor(
    private gitHubService: GitHubService,
    private toastr: ToastrService,
  ) {
    this.repoDetails = APP_CONSTANTS.REPO_ROUTE;
    this.subscriptions = new Subscription();
  }

  ngAfterViewInit(): void {
    this.getRepositories();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getRepositories(): void {
    this.loadingRepos = true;
    this.loadingReposError = false;

    const reposObs = this.gitHubService.getRepos(this.user).subscribe(
      (repos: Repository[]) => {
        this.repos = repos;
        this.sortDesc();
      }, (error) => {
        this.toastr.error(error.message);
        this.loadingReposError = true;
      }, () => {
        this.loadingRepos = false;
      }
    );
    this.subscriptions.add(reposObs);
  }

  toggleSort(): void {
    this.isSortingDesc = !this.isSortingDesc;
    if (this.isSortingDesc) {
      this.repos.sort((a, b) => (a.stargazers_count < b.stargazers_count) ? 1 : ((b.stargazers_count < a.stargazers_count) ? -1 : 0));
    } else {
      this.repos.sort((a, b) => (a.stargazers_count > b.stargazers_count) ? 1 : ((b.stargazers_count > a.stargazers_count) ? -1 : 0));
    }
  }

  sortDesc(): void {
    this.isSortingDesc = true;
    this.repos.sort((a, b) => (a.stargazers_count < b.stargazers_count) ? 1 : ((b.stargazers_count < a.stargazers_count) ? -1 : 0));
  }

}

import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Repository } from 'src/app/interfaces/repository';
import { GitHubService } from 'src/app/services/github/github.service';

@Component({
  selector: 'app-repository-details',
  templateUrl: './repository-details.component.html',
  styleUrls: ['./repository-details.component.scss']
})
export class RepositoryDetailsComponent implements AfterViewInit {

  user: string;
  name: string;

  repo: Repository;
  loading: boolean;
  loadingError: boolean;
  subscriptions: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private gitHubService: GitHubService,
    private toastr: ToastrService,
  ) {
    this.loading = true;
    this.loadingError = false;
    this.subscriptions = new Subscription();
    this.getRouteParams();
  }

  ngAfterViewInit(): void {
    this.getRepository();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getRouteParams(): void {
    this.user = this.activatedRoute.snapshot.paramMap.get('login');
    this.name = this.activatedRoute.snapshot.paramMap.get('name');
  }

  getRepository(): void {
    this.loading = true;
    this.loadingError = false;

    const reposObs = this.gitHubService.getRepoDetails(this.user, this.name).subscribe(
      (repo: Repository) => {
        this.repo = repo;
        this.loading = false;
      }, (error) => {
        this.toastr.error(error.message);
        this.loadingError = true;
        this.loading = false;
      }
    );
    this.subscriptions.add(reposObs);
  }

  hasAnyData(): boolean {
    const {stargazers_count, watchers, forks, open_issues} = this.repo;
    return !!(stargazers_count || watchers || forks || open_issues);
  }
}

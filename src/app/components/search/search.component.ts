import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { User } from 'src/app/interfaces/user';
import { GitHubService } from 'src/app/services/github/github.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  @Input() root: boolean;

  form: FormGroup;
  results: User[];
  page: number;
  currQueryLength: number;
  currResultsLength: number;
  loadingError: boolean;
  loading: boolean;
  slideIn: boolean;
  subscriptions: Subscription;

  constructor(private gitHubService: GitHubService, private toastr: ToastrService) {
    this.page = 1;
    this.currResultsLength = 0;
    this.slideIn = false;
    this.results = [];
    this.subscriptions = new Subscription();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  buildForm(): void {
    this.form = new FormGroup({query: new FormControl('')});
    this.reactToFormChanges();
  }

  reactToFormChanges(): void {
    this.form.valueChanges.pipe(
      debounceTime(APP_CONSTANTS.SEARCH_DEBOUNCE_TIME)
    ).subscribe(({query}) => {
      if (query && query.length >= 2) {
        this.search();
      } else {
        this.resetParams();
      }
    });
  }

  reset(): void {
    this.form.reset();
    this.resetParams();
    this.results = [];
  }

  resetParams(): void {
    this.page = 0;
    this.currResultsLength = 0;
    delete this.currQueryLength;
  }

  animateResults(): void {
    this.slideIn = true;
  }

  animateBack(): void {
    this.slideIn = false;
  }

  leave(): void {
    this.animateBack();
    this.reset();
  }

  search(pagination?: boolean): void {
    this.loadingError = false;
    this.loading = true;

    const page = pagination ? this.page : 1;

    const searchObservable = this.gitHubService.searchUsers(this.queryStr, page).subscribe(({users, length}) => {
      const animationTimeout = this.slideIn === true ? 0 : 390;

      this.animateResults();

      setTimeout(() => {
        this.currResultsLength += length;
        this.currQueryLength = length;
        this.page++;
        this.results.push(...users);
      }, animationTimeout);

    }, ({error}) => {
      this.toastr.error(error.message);
    }, () => {
      this.loading = false;
    });

    this.subscriptions.add(searchObservable);
  }

  get queryStr(): string {
    return this.form.value.query;
  }

}

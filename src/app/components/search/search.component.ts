import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('field') field: any;

  form: FormGroup;
  results: User[];
  page: number;
  lastQueryStr: string;
  loadingError: boolean;
  loading: boolean;
  slideIn: boolean;
  searchAttempt: number;
  subscriptions: Subscription;

  constructor(
    private gitHubService: GitHubService,
    private toastr: ToastrService,
    private location: Location
  ) {
    this.searchAttempt = 0;
    this.page = 1;
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
        this.reset();
      }
    });
  }

  reset(force?: boolean): void {
    this.results = [];
    this.page = 1;

    if (force) {
      this.form.reset();
    }
  }

  animateResults(): void {
    this.slideIn = true;
  }

  animateBack(): void {
    this.slideIn = false;
  }

  leave(): void {
    this.animateBack();
    this.reset(true);
  }

  navigateBack(): void {
    this.location.back();
  }

  prepareNewAttempt(): void {
    this.searchAttempt = 0;
    this.reset(true);
    this.field.nativeElement.focus();
  }

  search(pagination?: boolean): void {
    this.loadingError = false;
    this.loading = true;

    if (!pagination) {
      this.reset();
    }

    this.lastQueryStr = this.queryStr;

    const searchObs = this.gitHubService.searchUsers(this.queryStr, this.page).subscribe(
      ({users}) => {
        const animationTimeout = this.slideIn === true ? 0 : 390;
        this.animateResults();

        setTimeout(() => {
          this.page++;
          this.results.push(...users);
          this.searchAttempt++;
        }, animationTimeout);

        this.loading = false;
      }, ({error}) => {
        this.loading = false;
        this.toastr.error(error.message);
      }
    );

    this.subscriptions.add(searchObs);
  }

  get queryStr(): string {
    return this.form.value.query;
  }

}

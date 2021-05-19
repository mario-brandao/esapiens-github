import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GitHubService } from 'src/app/services/github/github.service';
import { User } from 'src/app/interfaces/user';
import { ToastrService } from 'ngx-toastr';
import { empty, Observable, Subject } from 'rxjs';
import { catchError, debounceTime } from 'rxjs/operators';
import { APP_CONSTANTS } from 'src/app/app.constants';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  form: FormGroup;
  results$: Observable<User[]>;
  error$: Subject<boolean>;

  constructor(private gitHubService: GitHubService, private toastr: ToastrService) {
    this.error$ = new Subject();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.form = new FormGroup({query: new FormControl('')});
    this.reactToFormChanges();
  }

  reactToFormChanges(): void {
    this.form.valueChanges.pipe(
      debounceTime(APP_CONSTANTS.SEARCH_DEBOUNCE_TIME)
    ).subscribe(_ => {
      this.search();
    });
  }

  reset(): void {
    this.form.reset();
  }

  // TODO: add search param (page counter)

  search(): void {
    this.results$ = this.gitHubService.searchUsers(this.queryStr)
      .pipe(catchError(({error}) => {
        this.toastr.error(error.message);
        this.error$.next(true);
        return empty();
      })
    );
  }

  get queryStr(): string {
    return this.form.value.query;
  }

}

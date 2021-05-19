import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { empty, Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user';
import { GitHubService } from 'src/app/services/github/github.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userLoginParam: string;

  user$: Observable<User>;
  error$: Subject<boolean>;

  constructor(
    private route: ActivatedRoute,
    private gitHubService: GitHubService,
    private toastr: ToastrService,
  ) {
    this.userLoginParam = this.route.snapshot.paramMap.get('login');
    this.error$ = new Subject();
  }

  ngOnInit(): void {
    this.user$ = this.gitHubService.getUser(this.userLoginParam)
      .pipe(catchError(({error}) => {
        this.toastr.error(error.message);
        this.error$.next(true);
        return empty();
      })
    );
  }

}

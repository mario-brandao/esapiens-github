import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {

  constructor(private httpClient: HttpClient) { }

  searchUsers(query: string, page = 1, limit = 15): Observable<any> {
    return this.httpClient.get<any>(
      `${APP_CONSTANTS.SEARCH_API}${APP_CONSTANTS.API_TERMS.USERS}?q=${query}&page=${page}&per_page=${limit}`
    ).pipe(
      map(({items, total_count}) => {
        return {users: items, length: total_count};
      }),
      catchError(error => throwError(error))
    );
  }

  getUser(login: string): Observable<User> {
    return this.httpClient.get<User>(`${APP_CONSTANTS.USERS_API}/${login}`);
  }
}

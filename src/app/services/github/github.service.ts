import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {

  constructor(private httpClient: HttpClient) { }

  searchUsers(query: string, page = 0, limit = 3): Observable<User[]> {
    return this.httpClient.get<any>(
      `${APP_CONSTANTS.SEARCH_API}${APP_CONSTANTS.API_TERMS.USERS}?q=${query}&page=${page}&per_page=${limit}`
    ).pipe(map(({items}) => {
      console.log(items);

      return items;
    }));
  }

  getUser(login: string): Observable<User> {
    return this.httpClient.get<User>(`${APP_CONSTANTS.USERS_API}/${login}`);
  }
}

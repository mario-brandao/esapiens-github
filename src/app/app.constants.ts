import { environment } from "src/environments/environment";

export class APP_CONSTANTS {
  public static BASE_API = environment.API;
  public static API_TERMS = {
    USERS: 'users',
    SEARCH: 'search',
    REPOS: 'repos',
  };
  public static SEARCH_API = `${APP_CONSTANTS.BASE_API}${APP_CONSTANTS.API_TERMS.SEARCH}/`;
  public static USERS_API = `${APP_CONSTANTS.BASE_API}${APP_CONSTANTS.API_TERMS.USERS}`;
  public static REPO_API = `${APP_CONSTANTS.BASE_API}${APP_CONSTANTS.API_TERMS.REPOS}`;

  public static USER_ROUTE = 'user';
  public static REPO_ROUTE = 'repository';

  public static SEARCH_DEBOUNCE_TIME = 600;
}

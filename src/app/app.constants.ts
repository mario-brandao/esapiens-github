

export class APP_CONSTANTS {
  public static BASE_API = 'https://api.github.com/';
  public static API_TERMS = {
    USERS: 'users',
    SEARCH: 'search',
  };
  public static SEARCH_API = `${APP_CONSTANTS.BASE_API}${APP_CONSTANTS.API_TERMS.SEARCH}/`;
  public static USERS_API = `${APP_CONSTANTS.BASE_API}${APP_CONSTANTS.API_TERMS.USERS}`;
  public static REPOS_API = `repos`;


  public static USER_ROUTE = 'user';

  public static SEARCH_DEBOUNCE_TIME = 600;
}

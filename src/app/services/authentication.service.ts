import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, empty, Observable, of, Subject, EMPTY, throwError } from 'rxjs';
import { catchError, filter, map, skipWhile, switchMap, tap } from 'rxjs/operators';
import { Role, User } from '../models/user';
import { ConfigService } from './config.service';
import { TokenInterceptor } from './token.interceptor';
import { UserService } from './user.service';

const accessTokenKey = 'access_token';
const refreshTokenKey = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private jwtHelper: JwtHelperService;
  private accessTokenSubject: BehaviorSubject<string>;
  accessToken$: Observable<string>;
  private loggedUserSubject: BehaviorSubject<User>;
  loggedUser$: Observable<User>;
  private logoutSubject: Subject<string>;
  logout$: Observable<string>;
  private userLoading = false;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private router: Router,
    private userService: UserService,
  ) {
    console.log('init auth');
    this.jwtHelper = new JwtHelperService();
    TokenInterceptor.init(this);
    this.initAccessTokenPipe();
    this.initLoggedUserPipe();
    this.logoutSubject = new Subject<string>();
    this.logout$ = this.logoutSubject.asObservable();
  }

  private initAccessTokenPipe() {
    this.accessTokenSubject = new BehaviorSubject(this.accessToken);
    this.accessToken$ = this.accessTokenSubject.asObservable().pipe(
      // filter(token => !!token),
      switchMap(token => {
        if (token && this.jwtHelper.isTokenExpired(token)) {
          console.log('access token expired');
          // blocks loggedUser to emit until currrent user is loaded
          this.userLoading = true;
          return this.loadAccessTokenUsingRefreshToken();
        }
        console.log(`access token available ${!!token}`);
        return token ? of(token) : EMPTY;
      }),
    );
  }

  private initLoggedUserPipe() {
    this.userLoading = true;
    this.loggedUserSubject = new BehaviorSubject<User>(null);
    this.loggedUser$ = this.loggedUserSubject.asObservable().pipe(
      skipWhile(() => {
        // this stops loggedUser subject to emit when the current user is being loaded
        // it's mainly used inside auth guard, in order to make it waits for current user to be loaded before checking next url
        // console.log(`skip loggedUser ${this.userLoading}`);
        return this.userLoading;
      }),
    );
    this.accessTokenSubject.asObservable().pipe(
      // blocks loggedUser to emit until currrent user is loaded
      tap(() => this.userLoading = true),
      switchMap(token => this.extractLoggedUser(token)))
      .subscribe(user => {
        console.log(`logged user change ${user ? user.email : null}`);
        // permits loggedUser to emit new values
        this.userLoading = false;
        this.loggedUserSubject.next(user);
      });
  }

  get loggedUser(): User {
    return this.loggedUserSubject.value;
  }

  interceptUrl(req: HttpRequest<any>): boolean {
    return req.url.startsWith(this.config.config.serverUrl)
      && !req.url.startsWith(this.config.config.signinUrl)
      && !req.headers.get('Authorization');
  }

  login(username: string, password: string): Promise<string> {
    return this.loadAccessToken(true, null, username, password).toPromise();
  }

  logout(msg: string): Promise<boolean> {
    console.log('logout');
    this.clearToken();
    this.logoutSubject.next(msg);
    return this.router.navigate(['/login']);
  }

  currentUserUpdateForceLogout(user: User): boolean {
    console.log(`force update of logged user ${user.email}`);
    if (user.email !== this.loggedUserSubject.value.email || user.role !== this.loggedUserSubject.value.role) {
      this.logout('Changed email or role of the current user: forced logout');
      return true;
    }
    this.accessTokenSubject.next(this.accessTokenSubject.value);
    return false;
  }

  hasRole(role: string): Observable<boolean> {
    return this.loggedUser$.pipe(map(loggedUser => loggedUser && loggedUser.role === Role[role]));
  }

  private extractLoggedUser(accessToken): Observable<User> {
    if (accessToken) {
      const data = this.jwtHelper.decodeToken(accessToken);
      // console.log(data);
      if (data) {
        return this.userService.findByEmail(data.user_name);
      }
    }
    return of(null);
  }

  private get accessToken(): string {
    const token = this.getToken(accessTokenKey);
    return token && !this.jwtHelper.isTokenExpired(token) ? token : null;
  }

  private loadAccessTokenUsingRefreshToken(): Observable<string> {
    const token = this.getToken(refreshTokenKey);
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      console.log('refresh token expired: must logout');
      this.logout('Refresh token expired');
      return EMPTY;
    }
    return this.loadAccessToken(false, token);
  }

  private loadAccessToken(retrieveAccessToken: boolean, refreshToken?: string, username?: string, password?: string):
    Observable<string> {
    console.log(retrieveAccessToken ? 'login' : 'refresh_token');
    const params = retrieveAccessToken ?
      new HttpParams()
        .set('username', username)
        .set('password', password)
        .set('grant_type', 'password') :
      new HttpParams()
        .set(refreshTokenKey, refreshToken)
        .set('grant_type', refreshTokenKey);
    return this.http.post<any>(this.config.config.loginUrl, params,
      {
        headers: new HttpHeaders().append('Authorization',
          'Basic ' + btoa(`${this.config.config.clientId}:${this.config.config.clientSecret}`)),
      }
    ).pipe(
      // delay(2000),
      map(jwt => {
        console.log('load token response');
        // console.log(jwt);
        return this.storeToken(jwt);
      }),
      catchError(error => {
        console.error(error);
        if (refreshToken) {
          this.logout('Error loading access token, force logout.');
        }
        throw error;
      })
    );
  }

  private getToken(key: string): string {
    return localStorage.getItem(key);
  }

  private setToken(key: string, token: string) {
    localStorage.setItem(key, token);
  }

  private clearToken() {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
    this.accessTokenSubject.next(null);
  }

  private storeToken(jwt: any): string {
    console.log(`store token`);
    if (jwt && jwt[accessTokenKey]) {
      const accessToken = jwt[accessTokenKey];
      if (jwt[refreshTokenKey]) {
        this.setToken(refreshTokenKey, jwt[refreshTokenKey]);
      }
      this.setToken(accessTokenKey, accessToken);
      this.accessTokenSubject.next(accessToken);
      return accessToken;
    }
    console.log('token invalid');
    return null;
  }

}

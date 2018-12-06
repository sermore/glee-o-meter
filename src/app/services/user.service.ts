import { Injectable } from '@angular/core';
import { StoreService, ApiError } from './store-service';
import { User } from '../models/user';
import { ConfigService } from './config.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';

export class UserServiceFilter {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends StoreService<User> {

  signinUrl: string;

  constructor(http: HttpClient, config: ConfigService) {
    console.log('init userservice');
    super(User, http, config.config.serverUrl + 'users', config.config.serverUrl + 'users/search');
    this.signinUrl = config.config.signinUrl;
  }

  prepareData(item: User): Object {
    return item;
  }
  applyFilter(url: string, filter: UserServiceFilter, params: HttpParams): { url: string; params: HttpParams; } {
    if (filter && filter.email) {
      url = this.searchUrl;
      params = params.set('email', filter.email);
    }
    return { url, params };
  }

  findByEmail(email: string): Observable<User> {
    return this.http.get<User>(this.collectionUrl + '/findByEmail', { params: new HttpParams().set('email', email) });
  }

  changePassword(id: number, oldPassword: string, newPassword: string): Observable<boolean> {
    console.log(`change password ${id} ${oldPassword} ${newPassword}`);
    return this.http.put<void>(this.collectionUrl + `/${id}/changePassword`,
      new HttpParams().set('id', String(id)).set('oldPassword', oldPassword).set('newPassword', newPassword)
    ).pipe(map(() => true));
  }

  signin(email: string, password: string): Observable<User> {
    console.log('signin ${email} ${password}');
    return this.http.post<User>(this.signinUrl, new HttpParams().set('email', email).set('password', password));
  }

  validateEmail(email: string): Observable<boolean> {
    console.log(`validateEmail ${email}`);
    return this.http.post<boolean>(this.signinUrl + '/validateEmail', new HttpParams().set('email', email));
  }

}

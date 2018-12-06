import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface Config {
  serverUrl: string;
  loginUrl: string;
  signinUrl: string;
  clientId: string;
  clientSecret: string;
}

export function configServiceInitializerFactory(config: ConfigService): Function {
  return () => config.load();
}

@Injectable()
export class ConfigService {

  private readonly configUrl = 'assets/config.json';
  config: Config;
  ready$: Observable<void>;
  private readySubject: Subject<void>;

  constructor(private http: HttpClient) {
    this.readySubject = new Subject();
    this.ready$ = this.readySubject.asObservable();
  }

  load(): Promise<any> {
    console.log('load resources');
    return this.http.get<Config>(this.configUrl).pipe(
      tap((cfg) => {
        this.config = cfg;
        this.readySubject.next();
        this.readySubject.complete();
      })).toPromise();
  }

}

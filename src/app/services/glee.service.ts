import { Injectable } from '@angular/core';
import { Glee } from '../models/glee';
import { StoreService } from './store-service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';

export class GleeServiceFilter {
  fromDate: Date;
  toDate: Date;
  fromTime: Date;
  toTime: Date;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class GleeService extends StoreService<Glee> {

  constructor(http: HttpClient, config: ConfigService) {
    super(Glee, http, config.config.serverUrl + 'glee', config.config.serverUrl + 'glee/search');
  }

  applyFilter(url: string, filter: GleeServiceFilter, params: HttpParams): { url: string; params: HttpParams; } {
    if (filter) {
      url = this.searchUrl;
      if (filter.fromDate) {
        // this.resetTime(filter.fromDate);
        params = params.set('fromDate', this.extractDate(filter.fromDate));
      }
      if (filter.toDate) {
        // this.resetTime(filter.toDate);
        params = params.set('toDate', this.extractDate(filter.toDate));
      }
      if (filter.fromTime) {
        filter.fromTime.setSeconds(0);
        // this.resetDate(filter.fromTime);
        params = params.set('fromTime', this.extractTime(filter.fromTime));
      }
      if (filter.toTime) {
        filter.toTime.setSeconds(0);
        // this.resetDate(filter.toTime);
        params = params.set('toTime', this.extractTime(filter.toTime));
      }
      if (filter.userId) {
        params = params.set('userId', String(filter.userId));
      }
    }
    return { url, params };
  }

  // private resetDate(date: Date): Date {
  //   date.setDate(1);
  //   date.setMonth(0);
  //   date.setFullYear(1970);
  //   return date;
  // }

  // private resetTime(date: Date): Date {
  //   date.setHours(0);
  //   date.setMinutes(0);
  //   date.setSeconds(0);
  //   date.setMilliseconds(0);
  //   return date;
  // }

  private extractDate(d: Date): string {
    return `${d.getFullYear()}-` +
      `${d.getMonth() < 9 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}-` +
      `${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}`;
  }

  private extractTime(d: Date): string {
    return `${d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:` +
      `${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}:` +
      `${d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()}`;
  }

  prepareData(item: Glee): any {
    console.log(item);
    const data: any = Object.assign({}, item);
    data.date = this.extractDate(item.date);
    data.time = this.extractTime(item.time);
    data.user = { id: item.userId };
    return data;
  }
}

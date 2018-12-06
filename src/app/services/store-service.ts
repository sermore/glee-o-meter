import { Observable } from 'rxjs';
import { SortDirection } from '@angular/material';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface RestResponse {
    content: [];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
    sort: { sorted: boolean, unsorted: boolean, empty: boolean };
}

export interface StoreServiceSort {
    active: string;
    direction: SortDirection;
}

export interface StoreServiceResult<T> {
    data: T[];
    size: number;
}

export interface StoreServiceConfig<T> {
    page: number;
    limit: number;
    size: number;
    sort: StoreServiceSort;
}

export interface AbstractResource {
    id: number;
}

export interface ApiError {
    debugMessage?: string;
    message: string;
    status: string;
    subErrors: [{
        field: string,
        message: string,
        object: string,
        rejectedValue: string
    }];
    timestamp: string;
}

export function formatError(httpError: any): string {
    if (httpError && httpError.error && httpError.error.apierror) {
        const error = httpError.error.apierror;
        console.log(error);
        let msg = error.message;
        for (let i = 0; i < error.subErrors.length; i++) {
            const e = error.subErrors[i];
            msg += `: ${e.message} on ${e.field}\n`;
        }
        return msg;
    }
    return httpError.message ? httpError.message : 'connection problem with server';
}

export abstract class StoreService<T extends AbstractResource> {

    protected constructor(
        private modelConstructor: new (data: any) => T,
        protected http: HttpClient,
        protected readonly collectionUrl: string,
        protected readonly searchUrl: string
    ) { }

    abstract applyFilter(url: string, filter: any, params: HttpParams): { url: string, params: HttpParams };

    load(config: StoreServiceConfig<T>, filter: any): Observable<StoreServiceResult<T>> {
        let params = new HttpParams();
        if (config) {
            params = params.set('page', config.page.toString());
            params = params.set('size', config.limit.toString());
            if (config.sort.direction) {
                params = params.set('sort', config.sort.active + ',' + config.sort.direction);
            }
        }
        const cfg = this.applyFilter(this.collectionUrl, filter, params);
        console.log(`load ${cfg.url}, ${cfg.params.toString()}`);
        return this.http.get<RestResponse>(cfg.url, { params: cfg.params })
            .pipe(map(res => this.parseResponse(res)));
    }

    private parseResponse(res: RestResponse): StoreServiceResult<T> {
        const data: T[] = [];
        for (let i = 0; i < res.content.length; i++) {
            const model = this.createModel(res.content[i]);
            data.push(model);
        }
        return { data: data, size: res.totalElements };
    }

    private createModel(data: any): T {
        return new (this.modelConstructor)(data);
    }

    abstract prepareData(item: T): any;

    update(model: T): Observable<boolean> {
        const url = this.collectionUrl + '/' + model.id;
        const data = this.prepareData(model);
        return this.http.put(url, data).pipe(
            map(res => {
                console.log(`updated ${model.constructor.name} ${model.id}`);
                return true;
            }));
    }

    delete(model: T): Observable<boolean> {
        return this.http.delete(this.collectionUrl + '/' + model.id).pipe(map(res => {
            console.log(`deleted ${model.constructor.name} ${model.id}`);
            return true;
        }));
    }

    create(model: T): Observable<T> {
        const data: any = this.prepareData(model);
        return this.http.post<T>(this.collectionUrl, data).pipe(map(res => {
            console.log(`created ${model.constructor.name} ${model.id}`);
            return this.createModel(res);
        }));
    }
}

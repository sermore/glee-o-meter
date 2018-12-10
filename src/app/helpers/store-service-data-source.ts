import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { StoreService, AbstractResource, formatError } from '../services/store-service';
import { CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatSnackBar } from '@angular/material';

export class StoreServiceDataSource<T extends AbstractResource> extends DataSource<T> {

  private _subscription: Subscription;
  private subject: BehaviorSubject<T[]>;
  private loadingSubject: BehaviorSubject<boolean>;
  loading$: Observable<boolean>;
  private _paginator: MatPaginator;
  filter: any;
  private _sort: MatSort;

  constructor(protected storeService: StoreService<T>, private snackBar?: MatSnackBar) {
    super();
    this.subject = new BehaviorSubject<T[]>([]);
    this.loadingSubject = new BehaviorSubject<boolean>(true);
    this.loading$ = this.loadingSubject.asObservable();
    this._subscription = new Subscription();
  }

  get data(): T[] {
    return this.subject.value;
  }

  get paginator(): MatPaginator {
    return this._paginator;
  }

  set paginator(paginator: MatPaginator) {
    this._paginator = paginator;
    this._subscription.add(paginator.page.subscribe((event) => {
      console.log(`paginator ${paginator.pageIndex}, ${paginator.pageSize}`);
      this.load();
    }));
  }

  get sort(): MatSort {
    return this._sort;
  }

  set sort(sort: MatSort) {
    this._sort = sort;
    this._subscription.add(sort.sortChange.subscribe((event) => {
      console.log(`sort ${sort.disabled} ${sort.active} ${sort.direction}`);
      this.load();
    }));
  }

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    this._subscription.add(collectionViewer.viewChange.subscribe(change => {
      console.log(`viewChange ${change.start}, ${change.end}`);
      this.load();
    }));
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.log(`disconnect`);
    this.subject.complete();
    this.loadingSubject.complete();
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  applyFilter(filter: any) {
    console.log(`apply filter`);
    this.filter = filter;
    this._paginator.length = 0;
    this._paginator.pageIndex = 0;
    this.load();
  }

  public create(item: T): Observable<T> {
    this.loadingSubject.next(true);
    return this.storeService.create(item).pipe(tap(res => this.load()));
  }

  public delete(i: number): Observable<boolean> {
    this.loadingSubject.next(true);
    return this.storeService.delete(this.subject.value[i]).pipe(tap(res => this.load()));
  }

  public update(i: number, item: T): Observable<boolean> {
    this.loadingSubject.next(true);
    return this.storeService.update(item).pipe(tap(res => this.load()));
  }

  private load() {
    this.loadingSubject.next(true);
    const config = {
      page: this._paginator.pageIndex,
      limit: this._paginator.pageSize,
      size: 0,
      sort: {
        active: this._sort.active,
        direction: this._sort.direction
      }
    };
    console.log(`load ${config.page}, ${config.limit}`);
    this._subscription.add(this.storeService.load(config, this.filter).pipe(
      catchError((err) => {
        if (this.snackBar) {
          this.snackBar.open(`load failed due to ${formatError(err)}`);
        }
        return of({ data: [], size: 0 });
      }),
      finalize(() => { this.loadingSubject.next(false); })
    ).subscribe(result => {
      this.paginator.length = result.size;
      this.subject.next(result.data);
    }));
  }
}

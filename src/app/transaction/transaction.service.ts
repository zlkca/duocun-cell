import { Injectable } from '@angular/core';
import { EntityService } from '../entity.service';
import { AuthService } from '../account/auth.service';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends EntityService {
  url;

  constructor(
    public authSvc: AuthService,
    public http: HttpClient,
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'Transactions';
  }

  loadPage(filter: any, currentPageNumber: number, itemsPerPage: number ): Observable<any> {
    const url = this.url + '/loadPage/' + currentPageNumber + '/' + itemsPerPage;
    return this.doGet(url, filter);
  }
}

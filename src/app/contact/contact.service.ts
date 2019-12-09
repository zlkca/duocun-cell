import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../account/auth.service';
import { EntityService } from '../entity.service';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends EntityService {

  url;

  constructor(
    public http: HttpClient,
    public authSvc: AuthService
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'Contacts';
  }

  sendVerifyMsg(d: any): Observable<any> {
    const url = this.url + '/sendVerifyMsg';
    return this.doPost(url, d);
  }

  verifyCode(code: string, accountId: string): Observable<any> {
    const url = this.url + '/verifyCode';
    return this.doPost(url, {code: code, accountId: accountId});
  }
}

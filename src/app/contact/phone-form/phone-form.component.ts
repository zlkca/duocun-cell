import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PageActions } from '../../main/main.actions';
import { IContact, Contact } from '../contact.model';
import { IContactAction } from '../contact.reducer';
import { ContactActions } from '../contact.actions';
import { ContactService } from '../contact.service';
import { IAppState } from '../../store';
import { AccountService } from '../../account/account.service';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import * as Cookies from 'js-cookie';
import { IDelivery } from '../../delivery/delivery.model';

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html',
  styleUrls: ['./phone-form.component.scss']
})
export class PhoneFormComponent implements OnInit {
  @Input() contact: IContact;
  @Input() form;

  phone;
  verificationCode;

  account;
  onDestroy$ = new Subject<any>();
  bGettingCode = false;
  counter = 60;
  countDown;
  fromPage;
  location;

  // get verificationCode() { return this.form.get('verificationCode'); }

  constructor(
    private fb: FormBuilder,
    private accountSvc: AccountService,
    private contactSvc: ContactService,
    private rx: NgRedux<IAppState>,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // this.form = this.fb.group({
    //   phone: [''],
    //   verificationCode: ['']
    // });
    // if (this.form) {
    //   this.phone = new FormControl('', Validators.required);
    //   this.verificationCode = new FormControl('', Validators.required);

    //   this.form.addControl('phone', this.phone);
    //   this.form.addControl('verificationCode', this.verificationCode);

    //   if (this.contact) {
    //     this.form.patchValue(this.contact);
    //   }
    // }



    // this.clearVerification();
    // this.rx.dispatch({
    //   type: PageActions.UPDATE_URL,
    //   payload: { name: 'phone-form' }
    // });

    // this.fromPage = this.route.snapshot.queryParamMap.get('fromPage');
  }

  ngOnInit() {
    const self = this;
    this.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
      self.account = account;
    });

    // this.rx.select('contact').pipe(takeUntil(this.onDestroy$)).subscribe((contact: IContact) => {
    //   if (contact) {
    //     this.contact = new Contact(contact);
    //     this.contact.verified = false;
    //     contact.verificationCode = '';
    //     this.form.patchValue(contact);
    //   }
    // });

    // this.rx.select('delivery').pipe(takeUntil(this.onDestroy$)).subscribe((d: IDelivery) => {
    //   self.location = d.origin;
    // });
  }


  // cancel() {
  //   const self = this;
  //   const phone = Cookies.get('duocun-old-phone');
  //   if (!self.contact) {
  //     self.contact = new Contact();
  //   }
  //   self.contact.phone = phone;

  //   self.rx.dispatch<IContactAction>({ type: ContactActions.UPDATE_PHONE_NUM, payload: { phone: phone } });

  //   Cookies.remove('duocun-old-phone');

  //   if (self.fromPage === 'account-setting') {
  //     self.router.navigate(['account/settings']);
  //   } else if (self.fromPage === 'restaurant-detail' || self.fromPage === 'order-form') {
  //     self.router.navigate(['order/form']);
  //   }
  // }

  // redirect(contact) {
  //   const self = this;
  //   if (self.fromPage === 'account-setting') {
  //     self.rx.dispatch<IContactAction>({ type: ContactActions.LOAD_FROM_DB, payload: contact });
  //     self.router.navigate(['account/settings']);
  //     self.snackBar.open('', '默认手机号已成功修改。', { duration: 1500 });
  //   } else if (self.fromPage === 'restaurant-detail') {
  //     // x.location = self.contact.location; // update address for the order
  //     // self.rx.dispatch<IContactAction>({ type: ContactActions.LOAD_FROM_DB, payload: oldContact }); // fix me
  //     self.rx.dispatch<IContactAction>({ type: ContactActions.UPDATE_WITHOUT_LOCATION, payload: contact });
  //     self.router.navigate(['order/form']);
  //     self.snackBar.open('', '默认手机号已成功保存。', { duration: 1500 });
  //   } else if (self.fromPage === 'order-form') {
  //     self.snackBar.open('', '默认手机号已成功保存。', { duration: 1500 });
  //     // self.rx.dispatch<IContactAction>({ type: ContactActions.LOAD_FROM_DB, payload: oldContact }); // fix me
  //     self.rx.dispatch<IContactAction>({ type: ContactActions.UPDATE_WITHOUT_LOCATION, payload: contact });
  //     self.router.navigate(['order/form'], { queryParams: { fromPage: 'order-form' } });
  //   }
  // }



}

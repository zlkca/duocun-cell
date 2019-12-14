import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { AccountService } from '../../account/account.service';
import { ContactService } from '../contact.service';
import { IAccount } from '../../account/account.model';
import { IContact, ICellApplication, CellApplicationStatus } from '../contact.model';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { MatSnackBar, MatDialog } from '../../../../node_modules/@angular/material';
import { CellApplicationService } from '../cell-application.service';
import { LocationService } from '../../location/location.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { environment } from '../../../environments/environment';
import { TermDialogComponent } from '../term-dialog/term-dialog.component';

@Component({
  selector: 'app-application-form-page',
  templateUrl: './application-form-page.component.html',
  styleUrls: ['./application-form-page.component.scss']
})
export class ApplicationFormPageComponent implements OnInit, OnDestroy {
  form;
  account;
  contact;
  application;
  loading = true;
  onDestroy$ = new Subject<any>();
  bGettingCode = false;
  counter = 60;
  countDown;
  fromPage;
  location;
  productId;

  Status = CellApplicationStatus;

  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get carrier() { return this.form.get('carrier'); }
  get address() { return this.form.get('address'); }
  get phone() { return this.form.get('phone'); }
  get verificationCode() { return this.form.get('verificationCode'); }
  get agree() { return this.form.get('agree'); }

  constructor(
    private fb: FormBuilder,
    private accountSvc: AccountService,
    private contactSvc: ContactService,
    private locationSvc: LocationService,
    private cellApplicationSvc: CellApplicationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public dialogSvc: MatDialog
  ) {
    const self = this;
    this.loading = true;
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      carrier: ['', Validators.required],
      phone: ['', Validators.required],
      verificationCode: ['', Validators.required],
      agree: ['', Validators.required],
    });

    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      this.productId = params['productId'];
    });

    this.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {
      self.account = account;
      if (account) {
        const q = { accountId: account._id };
        self.cellApplicationSvc.find(q).pipe(takeUntil(self.onDestroy$)).subscribe((cas: ICellApplication[]) => {
          if (cas && cas.length > 0) { // if has existing application, load it into the form
            const ca = cas[0];
            this.application = ca;
            ca.verificationCode = '';
            // ca.agree = true;
            this.loading = false;
            this.form.patchValue(ca);
            self.contactSvc.find(q).pipe(takeUntil(self.onDestroy$)).subscribe((contacts: IContact[]) => {
              this.loading = false;
              if (contacts && contacts.length > 0) {
                self.contact = contacts[0];
                self.contact.verificationCode = '';
                self.contact.verified = false;
                self.contact.address = this.locationSvc.getAddrString(self.contact.location);
              } else {
                self.contact = {
                  firstName: '',
                  lastName: '',
                  phone: '',
                  verificationCode: '',
                  verified: false,
                  address: '',
                  carrier: ''
                };
              }
            });
          } else {
            self.contactSvc.find(q).pipe(takeUntil(self.onDestroy$)).subscribe((contacts: IContact[]) => {
              this.loading = false;
              if (contacts && contacts.length > 0) {
                self.contact = contacts[0];
                self.contact.verificationCode = '';
                self.contact.verified = false;
                self.contact.address = this.locationSvc.getAddrString(self.contact.location);
                this.form.patchValue(self.contact);
              } else {
                self.contact = {
                  firstName: '',
                  lastName: '',
                  phone: '',
                  verificationCode: '',
                  verified: false,
                  address: '',
                  carrier: ''
                };
                this.form.patchValue(self.contact);
              }
            });
          }
        });
      }
    });
  }

  ngOnInit() {
    // this.rx.select('contact').pipe(takeUntil(this.onDestroy$)).subscribe((contact: IContact) => {
    //   if (contact) {
    //     this.contact = new Contact(contact);
    //     this.contact.verified = false;
    //     contact.verificationCode = '';
    //     this.form.patchValue(contact);
    //   }
    // });
  }

  clearVerification() {
    if (this.contact) {
      this.contact.verified = false;
      this.contact.verificationCode = '';
      this.verificationCode.patchValue('');
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onPhoneChange(e) {
    this.contact.verified = false;
    this.contact.verificationCode = '';
    this.contact.phone = e.value;
    // this.phone.patchValue(e.value);
    // this.verificationCode.patchValue('');
  }

  onVerificationCodeInput(e) {
    const self = this;
    const accountId = this.account._id;
    if (e.target.value && e.target.value.length === 4) {
      const code = e.target.value;
      this.contactSvc.verifyCode(code, accountId).pipe(takeUntil(this.onDestroy$)).subscribe(verified => {
        this.contact.verified = verified;
        if (verified) {
          if (self.countDown) {
            clearInterval(self.countDown);
          }
          setTimeout(() => {
            // self.save();
            if (self.contact.verified) {
              self.contactSvc.find({ accountId: accountId }).pipe(takeUntil(self.onDestroy$)).subscribe(contacts => {
                if (contacts && contacts.length > 0) {
                  // self.redirect(contacts[0]);
                }
              });
            }
          }, 1200);
        }
      });
    }
  }

  sendVerify() {
    const self = this;
    const accountId: string = self.account._id;
    const username: string = self.account.username;
    let phone: string = this.form.value.phone;

    if (phone) {
      phone = phone.match(/\d+/g).join('');
      const contact = { phone: phone, accountId: accountId, username: username };
      this.bGettingCode = true;
      this.counter = 60;
      this.countDown = setInterval(function () {
        self.counter--;
        if (self.counter === 0) {
          clearInterval(self.countDown);
          self.bGettingCode = false;
        }
      }, 1000);

      this.clearVerification();
      this.contactSvc.sendVerifyMsg(contact).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
        this.snackBar.open('', '短信验证码已发送', { duration: 1000 });
      });
    }
  }

  onSubmit() {
    const v = this.form.value;

    if (this.form.valid) {
      const appId = this.application ? this.application._id : null;
      const ca: any = {
        accountId: this.account._id,
        firstName: v.firstName,
        lastName: v.lastName,
        carrier: v.carrier,
        address: v.address,
        phone: v.phone,
        productId: this.productId,
        // verificationCode: v.verificationCode,
        status: CellApplicationStatus.APPLIED,
      };
      if (appId) {
        const q = { _id: appId };
        this.cellApplicationSvc.update(q, ca).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
          this.snackBar.open('', '申请已更新，请等候短信通知', { duration: 1000 });

          if (this.application.status === CellApplicationStatus.APPLIED) {
            this.router.navigate(['order/installation-form']);
          } else {
            this.router.navigate(['contact/application-result']);
          }
        });
      } else {
        this.cellApplicationSvc.save(ca).pipe(takeUntil(this.onDestroy$)).subscribe(x => {
          this.snackBar.open('', '申请已经保存，请等候短信通知', { duration: 1000 });
          this.router.navigate(['order/installation-form']);
        });
      }
    } else {
      alert('缺少输入或输入有错误，请仔细检查再提交');
      // for test
      // this.router.navigate(['order/installation-form']);
    }
  }

  onCheckboxChange(e) {
    // this.agree.errors.required = null;
  }

  onCarrierChange(e) {
    // this.carrier.errors.required = null;
  }

  openTermsPage() {
    // this.router.navigate(['contact/terms']);
    // const url = environment.APP_URL + '/contact/terms';
    // window.open(url);

    const params = {
      width: '100%',
      maxWidth: 'none',
      data: {
        title: '服务条款', content: '', buttonTextNo: '取消', buttonTextYes: '确认收款'
      },
      panelClass: 'term-dialog'
    };
    const dialogRef = this.dialogSvc.open(TermDialogComponent, params);

    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
      this.agree.patchValue(true);
    });
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AccountService } from '../../account/account.service';
import { GeoPoint } from '../../location/location.model';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../store';
import { SocketService } from '../../shared/socket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../account/auth.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { AccountActions } from '../../account/account.actions';
import { Account, Role, IAccount } from '../../account/account.model';

const APP = environment.APP;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  center: GeoPoint = { lat: 43.761539, lng: -79.411079 };
  account;
  loading = true;
  productId;
  onDestroy$ = new Subject<any>();

  constructor(
    private accountSvc: AccountService,
    private authSvc: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private rx: NgRedux<IAppState>,
  ) {

  }

  ngOnInit() {
    const self = this;

    this.loading = true;
    this.route.queryParamMap.pipe(takeUntil(this.onDestroy$)).subscribe(queryParams => {
      const code = queryParams.get('code');
      const clientId = queryParams.get('clientId'); // use for after card pay, could be null
      const page = queryParams.get('page');

      if (page === 'application_form') { // for wechatpay cell setup fee procedure
        this.accountSvc.quickFind({ _id: clientId }).pipe(takeUntil(this.onDestroy$)).subscribe((accounts: IAccount[]) => {
          this.rx.dispatch({ type: AccountActions.UPDATE, payload: accounts[0] });
          self.router.navigate(['contact/application-form']);
        });
        return;
      } else {
        this.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe(account => {
          if (account) {
            self.loginSuccessHandler(account);
          } else { // not login
            if (code) { // try wechat login
              self.accountSvc.wechatLogin(code).pipe(takeUntil(self.onDestroy$)).subscribe((data: any) => {
                if (data) {
                  self.authSvc.setUserId(data.userId);
                  self.authSvc.setAccessToken(data.id);
                  self.accountSvc.getCurrent().pipe(takeUntil(self.onDestroy$)).subscribe((acc: Account) => {
                    if (acc) {
                      self.account = acc;
                      self.loginSuccessHandler(acc);
                    } else {
                      self.loading = false;
                      this.router.navigate(['account/setting']);
                    }
                  });
                } else { // failed from shared link login
                  self.loading = false;
                  // tslint:disable-next-line:max-line-length
                  window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0591bdd165898739&redirect_uri=https://duocun.com.cn&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect';
                }
              });
            } else { // no code in router
              this.router.navigate(['account/login']);
            }
          }
        }, err => {
          this.router.navigate(['account/login']);
          console.log('login failed');
        });
      }
    });
  }


  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loginSuccessHandler(account: Account) {
    this.loading = false;
    this.rx.dispatch({ type: AccountActions.UPDATE, payload: account });
    this.router.navigate(['product/list']);
  }

  wechatLoginHandler(data: any) {
    const self = this;
    self.authSvc.setUserId(data.userId);
    self.authSvc.setAccessToken(data.id);
    self.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe((account: Account) => {
      if (account) {
        self.account = account;

        // this.snackBar.open('', '微信登录成功。', {
        //   duration: 1000
        // });
        // self.loading = false;
        // self.init(account);
      } else {
        // this.snackBar.open('', '微信登录失败。', {
        //   duration: 1000
        // });
      }
    });
  }

}

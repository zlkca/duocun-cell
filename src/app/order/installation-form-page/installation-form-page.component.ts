import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../product/product.service';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { IOrderItem, IOrder, OrderItem, ICart, ICartItem, OrderType, ICharge } from '../../order/order.model';
import { FormBuilder } from '../../../../node_modules/@angular/forms';
import { AccountService } from '../../account/account.service';
import { IAccount } from '../../account/account.model';
import { PaymentService } from '../../payment/payment.service';
import { MatSnackBar } from '../../../../node_modules/@angular/material';
import { IProduct } from '../../product/product.model';
import { OrderService } from '../../order/order.service';
import { ILocation } from '../../location/location.model';
import { CellApplicationService } from '../../contact/cell-application.service';
import { CellApplicationStatus } from '../../contact/contact.model';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-installation-form-page',
  templateUrl: './installation-form-page.component.html',
  styleUrls: ['./installation-form-page.component.scss']
})
export class InstallationFormPageComponent implements OnInit, OnDestroy {
  cart: ICart = null;
  product;
  charge;
  form;
  account;
  paymentMethod = '';
  loading = true;
  stripe;
  card;
  bSubmitted = false;
  bError = false;

  private onDestroy$ = new Subject<any>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountSvc: AccountService,
    private productSvc: ProductService,
    private paymentSvc: PaymentService,
    private orderSvc: OrderService,
    private cellApplicationSvc: CellApplicationService,
    private snackBar: MatSnackBar
  ) {
    const id = '5de94b8031846235e1518399';

    this.form = this.fb.group({
      note: ['']
    });

    this.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {
      this.account = account;
      if (account) {
        this.productSvc.find({ _id: id }).pipe(takeUntil(this.onDestroy$)).subscribe(ps => {
          // this.items = ps;
          this.cart = this.addToCart(account, ps);
          this.product = ps[0];
          this.charge = this.calcCharge(this.cart);

          if (this.account.balance >= this.charge.total) {
            this.paymentMethod = 'prepaid';
          }

          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  addToCart(account: IAccount, products: IProduct[]) {
    const items: ICartItem[] = [];
    const merchant = products[0].merchant;
    products.map(p => {
      items.push({
        productId: p._id,
        productName: p.name,
        price: p.price,
        cost: p.cost,
        quantity: 1,
        description: p.description
      });
    });

    const cart: ICart = {
      clientId: account._id,
      clientName: account.username,
      merchantId: merchant._id,
      merchantName: merchant.name, // fix me username or name ?
      items: items
    };
    return cart;
  }

  calcCharge(cart: ICart): ICharge {
    let cost = 0;
    let price = 0;
    cart.items.map(x => {
      cost += (x.cost * x.quantity);
      price += (x.price * x.quantity);
    });
    const tax = Math.ceil(price * 13) / 100;
    return {
      price: price,
      cost: cost,
      tax: tax,
      total: price + tax
    };
  }

  toOrderItems(items: ICartItem[]) {
    const its: IOrderItem[] = [];
    items.map(it => {
      its.push({ productId: it.productId, price: it.price, cost: it.cost, quantity: it.quantity });
    });
    return its;
  }

  createOrder(account: IAccount, cart: ICart, charge: ICharge, paymentMethod: string): IOrder {
    const DEFAULT_LOCATION: ILocation = {
      city: 'Richmond Hill',
      province: 'ON',
      streetName: 'Fulton Way',
      streetNumber: '30'
    };

    const order: IOrder = {
      clientId: account._id,
      clientName: account.username,
      merchantId: cart.merchantId,
      merchantName: cart.merchantName,
      items: this.toOrderItems(cart.items),
      price: Math.round(charge.price * 100) / 100,
      cost: Math.round(charge.cost * 100) / 100,
      total: Math.round(charge.total * 100) / 100,
      tax: Math.round(charge.tax * 100) / 100,
      location: DEFAULT_LOCATION,
      status: 'new',
      type: OrderType.TELECOMMUNICATIONS,
      paymentMethod: paymentMethod
    };

    return order;
  }

  // pay() {
  //   const contact = this.contact;
  //   const account = this.account;
  //   const charge = this.charge;
  //   const delivery = this.delivery;
  //   const cart = this.cart;
  //   const paymentMethod = this.paymentMethod;
  //   this.doPay(contact, account, charge, cart, delivery, paymentMethod);
  // }

  doPay(account: IAccount, charge: ICharge, cart: ICart, paymentMethod: string) {
    const self = this;

    if (this.bSubmitted) {
      this.snackBar.open('', '无法重复提交订单', { duration: 1000 });
      return;
    }

    if (!(cart.items && cart.items.length > 0)) {
      alert('购物车是空的');
      return;
    }

    this.bSubmitted = true;
    const v = this.form.value;
    const order = self.createOrder(account, cart, charge, paymentMethod);

    if (paymentMethod === 'card') {
      this.paymentSvc.vaildateCardPay(this.stripe, this.card, 'card-errors').then((ret: any) => {
        self.loading = false;
        if (ret.status === 'failed') {
          self.bSubmitted = false;
          self.bError = true;
        } else {
          self.handleCardPayment(account, ret.token, order);
        }
      });
    } else if (paymentMethod === 'cash' || paymentMethod === 'prepaid') {
      self.handleWithCash(account, order);
    } else { // wechat, alipay
      self.loading = false;
      self.handleSnappayPayment(account, order, cart);
    }
  }

  // only happend on balance < order.total
  handleWithCash(account: IAccount, order: IOrder) {
    const self = this;
    const balance: number = account.balance;
    // const dateType = delivery.dateType;
    this.accountSvc.update({ _id: account._id }, { type: 'client' }).pipe(takeUntil(self.onDestroy$)).subscribe(ret => {

    });
    if (order && order._id) { // modify order, now do not support
      if (order) {
        const orderId = order._id;
        self.orderSvc.update({ _id: orderId }, order).pipe(takeUntil(this.onDestroy$)).subscribe((r: IOrder) => {
          const q = { accountId: account._id };
          const d = { status: CellApplicationStatus.SETUP_PAID }; // fix me
          self.cellApplicationSvc.update(q, d).pipe(takeUntil(this.onDestroy$)).subscribe((ca: any) => {
            self.snackBar.open('', '您的订单已经成功修改。', { duration: 2000 });
            self.bSubmitted = false;
            self.loading = false;
            self.router.navigate(['contact/application-result']);
          });
        }, err => {
          self.snackBar.open('', '您的订单未更改成功，请重新更改。', { duration: 1800 });
        });
      } else {
        this.snackBar.open('', '登录已过期，请重新从公众号进入', { duration: 1800 });
      }
    } else { // create new
      if (order) {
        if (balance >= order.total) {
          order.status = 'paid';
        }
        self.orderSvc.save(order).pipe(takeUntil(self.onDestroy$)).subscribe((orderCreated: IOrder) => {
          const q = { accountId: account._id };
          const d = { status: orderCreated.status === 'paid' ? CellApplicationStatus.SETUP_PAID : CellApplicationStatus.ORDERED };
          self.cellApplicationSvc.update(q, d).pipe(takeUntil(this.onDestroy$)).subscribe((ret: any) => {
            self.snackBar.open('', '订单已成功保存', { duration: 1800 });
            self.bSubmitted = false;
            self.loading = false;
            self.router.navigate(['contact/application-result']);
          });
        }, err => {
          self.snackBar.open('', '您的订单未登记成功，请重新下单。', { duration: 1800 });
        });
      } else {
        self.bSubmitted = false;
        self.snackBar.open('', '登录已过期，请重新从公众号进入', { duration: 1800 });
      }
    } // end of create new
  }

  handleCardPayment(account: IAccount, token: any, order: IOrder) {
    const self = this;
    const balance: number = account.balance;
    const payable = Math.round((order.total - balance) * 100) / 100;
    order.status = 'tmp'; // create a temporary order

    this.accountSvc.update({ _id: account._id }, { type: 'client' }).pipe(takeUntil(self.onDestroy$)).subscribe(ret => {

    });
    // save order and update balance
    self.orderSvc.save(order).pipe(takeUntil(self.onDestroy$)).subscribe((ret: IOrder) => {
      const orderId = ret._id;
      self.paymentSvc.stripePayOrder(orderId, payable, token).pipe(takeUntil(self.onDestroy$)).subscribe((ch: any) => {
        self.bSubmitted = false;
        self.loading = false;
        if (ch.status === 'succeeded') {
          const q = { accountId: account._id };
          const d = { status: CellApplicationStatus.SETUP_PAID };
          self.cellApplicationSvc.update(q, d).pipe(takeUntil(this.onDestroy$)).subscribe((ca: any) => {
            self.snackBar.open('', '已成功付款', { duration: 1800 });
            self.snackBar.open('', '已成功下单', { duration: 2000 });
            self.router.navigate(['contact/application-result']);
          });
        } else {
          self.snackBar.open('', '付款未成功', { duration: 1800 });
          alert('付款未成功，请联系客服');
        }
      });
    }, err => {
      self.snackBar.open('', '您的订单未登记成功，请重新下单。', { duration: 1800 });
    });
  }

  handleSnappayPayment(account: IAccount, order: IOrder, cart: ICart) {
    const self = this;
    const balance: number = account.balance;
    const payable = Math.round((order.total - balance) * 100) / 100;
    order.status = 'tmp'; // create a temporary order

    this.accountSvc.update({ _id: account._id }, { type: 'client' }).pipe(takeUntil(self.onDestroy$)).subscribe(ret => {

    });

    self.orderSvc.save(order).pipe(takeUntil(self.onDestroy$)).subscribe((ret: IOrder) => {

      // if (paymentMethod === 'WECHATPAY' || paymentMethod === 'ALIPAY') {
      self.loading = false;
      this.paymentSvc.snappayPayOrder(ret, payable).pipe(takeUntil(self.onDestroy$)).subscribe((r) => {

        // this.msg = r.msg;
        // this.log = r.data[0].trans_no;

        self.bSubmitted = false;
        if (r.msg === 'success') {
          // this.loading = true;
          window.location.href = r.data[0].h5pay_url;
        } else {
          self.loading = false;
          self.snackBar.open('', '付款未成功', { duration: 1800 });
          alert('付款未成功，请联系客服');
        }
      });
    }, err => {
      self.snackBar.open('', '您的订单未登记成功，请重新下单。', { duration: 1800 });
    });
  }


  onSelectPaymentMethod(e) {
    const self = this;
    this.bError = false;
    this.paymentMethod = e.value;
    if (e.value === 'cash') {
      // product
    } else if (e.value === 'card') {
      setTimeout(() => {
        const rt = self.paymentSvc.initStripe('card-element', 'card-errors');
        self.stripe = rt.stripe;
        self.card = rt.card;
      }, 500);
    } else {
      // pass
    }
  }

  onSubmit() {
    const account = this.account;
    const charge = this.charge;
    const cart = this.cart;
    const paymentMethod = this.paymentMethod;
    if (!this.paymentMethod) {
      this.bError = true;
      return;
    }

    if (this.form.valid) {
      this.doPay(account, charge, cart, paymentMethod);
    } else {
      // other errors
    }
  }
}

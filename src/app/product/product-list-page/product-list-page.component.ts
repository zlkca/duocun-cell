import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { ProductService } from '../product.service';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject<any>();
  products = [];

  constructor(
    private router: Router,
    private productSvc: ProductService
  ) {
    const categoryId = '5de94c9c31846235e151839b';
    this.productSvc.find({categoryId: categoryId}).pipe(takeUntil(this.onDestroy$)).subscribe(ps => {
      this.products = ps;
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  apply(product) {
    const productId = product._id;
    this.router.navigate(['contact/application-form/' + productId]);
  }

  openDetail(product) {
    this.router.navigate(['product/list/' + product._id]);
  }
}

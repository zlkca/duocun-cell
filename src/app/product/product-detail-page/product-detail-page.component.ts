import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.scss']
})
export class ProductDetailPageComponent implements OnInit, OnDestroy {

  onDestroy$ = new Subject<any>();
  product;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productSvc: ProductService
  ) {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      const productId = params['id'];
      this.productSvc.findById(productId).pipe(takeUntil(this.onDestroy$)).subscribe(p => {
        this.product = p;
      });
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
}

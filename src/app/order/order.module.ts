import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatDatepickerModule } from '../../../node_modules/@angular/material/datepicker';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import { SharedModule } from '../shared/shared.module';
import { OrderService } from './order.service';
import { OrderRoutingModule } from './order-routing.module';
import { AccountService } from '../account/account.service';
import { ProductService } from '../product/product.service';

@NgModule({
  imports: [
    CommonModule,
    // MatTabsModule,
    // MatExpansionModule,
    // MatDatepickerModule,
    // MatSnackBarModule,
    // MatMomentDateModule,
    // MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    OrderRoutingModule,
    SharedModule
  ],
  exports: [
  ],
  providers: [
    OrderService,
    AccountService,
    ProductService
  ],
  declarations: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class OrderModule { }

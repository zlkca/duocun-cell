import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { OrderModule } from '../order/order.module';
// import { ImageUploadModule } from 'angular2-image-upload';
import { ImageUploaderModule } from '../image-uploader/image-uploader.module';
import { ProductRoutingModule } from './product-routing.module';
import { CategoryService } from '../category/category.service';
import { WarningDialogComponent } from '../shared/warning-dialog/warning-dialog.component';
import { ProductListPageComponent } from './product-list-page/product-list-page.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    SharedModule,
    // OrderModule,
    // ImageUploadModule.forRoot(),
    ImageUploaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
  ProductListPageComponent,
  ProductDetailPageComponent],
  exports: [

  ],
  providers: [
    CategoryService
  ],
  entryComponents: [WarningDialogComponent]
})
export class ProductModule { }

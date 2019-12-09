import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListPageComponent } from './product-list-page/product-list-page.component';
import { ProductDetailPageComponent } from './product-detail-page/product-detail-page.component';

const routes: Routes = [
  { path: 'list/:id', component: ProductDetailPageComponent },
  { path: 'list', component: ProductListPageComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

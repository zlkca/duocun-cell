import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // { path: 'history', component: OrderHistoryComponent },
  // { path: 'summary', component: SummaryPageComponent },
  // { path: 'package', component: PackagePageComponent },
  // { path: 'settlement', component: SettlementPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstallationFormPageComponent } from './installation-form-page/installation-form-page.component';

const routes: Routes = [
  // { path: 'history', component: OrderHistoryComponent },
  // { path: 'summary', component: SummaryPageComponent },
  // { path: 'package', component: PackagePageComponent },
  // { path: 'settlement', component: SettlementPageComponent }

  { path: 'installation-form', component: InstallationFormPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }

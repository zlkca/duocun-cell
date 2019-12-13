import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactFormPageComponent } from './contact-form-page/contact-form-page.component';
import { ApplicationFormPageComponent } from './application-form-page/application-form-page.component';
import { TermPageComponent } from './term-page/term-page.component';
import { ApplicationResultPageComponent } from './application-result-page/application-result-page.component';

const routes: Routes = [
  { path: 'form', component: ContactFormPageComponent },
  { path: 'application-form/:productId', component: ApplicationFormPageComponent },
  { path: 'application-form', component: ApplicationFormPageComponent },
  { path: 'terms', component: TermPageComponent },
  { path: 'application-result', component: ApplicationResultPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }

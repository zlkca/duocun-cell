import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSnackBarModule, MatDialogModule } from '../../../node_modules/@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactFormPageComponent } from './contact-form-page/contact-form-page.component';
import { ReactiveFormsModule, FormsModule } from '../../../node_modules/@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LocationModule } from '../location/location.module';
import { LocationService } from '../location/location.service';
import { AccountService } from '../account/account.service';
import { PhoneFormComponent } from './phone-form/phone-form.component';
import { ApplicationFormPageComponent } from './application-form-page/application-form-page.component';
import { TermPageComponent } from './term-page/term-page.component';
import { TermDialogComponent } from './term-dialog/term-dialog.component';
import { ApplicationResultPageComponent } from './application-result-page/application-result-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatDialogModule,
    ContactRoutingModule,
    SharedModule,
    LocationModule
  ],
  declarations: [
    ContactFormPageComponent,
    PhoneFormComponent,
    ApplicationFormPageComponent,
    TermPageComponent,
    TermDialogComponent,
    ApplicationResultPageComponent
  ],
  providers: [
    LocationService,
    AccountService,
    LocationService
  ],
  exports: [
    PhoneFormComponent
  ],
  entryComponents: [TermDialogComponent]
})
export class ContactModule { }

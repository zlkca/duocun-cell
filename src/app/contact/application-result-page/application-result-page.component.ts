import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from '../../../../node_modules/rxjs';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { AccountService } from '../../account/account.service';
import { IAccount } from '../../account/account.model';
import { ICellApplication, CellApplicationStatus } from '../contact.model';
import { MatSnackBar, MatDialog } from '../../../../node_modules/@angular/material';
import { CellApplicationService } from '../cell-application.service';
import { Router } from '../../../../node_modules/@angular/router';
import { environment } from '../../../environments/environment';
import { TermDialogComponent } from '../term-dialog/term-dialog.component';

@Component({
  selector: 'app-application-result-page',
  templateUrl: './application-result-page.component.html',
  styleUrls: ['./application-result-page.component.scss']
})
export class ApplicationResultPageComponent implements OnInit, OnDestroy {

  account;
  application;
  loading = true;
  onDestroy$ = new Subject<any>();


  Status = CellApplicationStatus;

  constructor(
    private accountSvc: AccountService,
    private cellApplicationSvc: CellApplicationService,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogSvc: MatDialog
  ) {
    const self = this;
    this.loading = true;

    this.accountSvc.getCurrent().pipe(takeUntil(this.onDestroy$)).subscribe((account: IAccount) => {
      self.account = account;
      if (account) {
        const q = { accountId: account._id };
        self.cellApplicationSvc.find(q).pipe(takeUntil(self.onDestroy$)).subscribe((cas: ICellApplication[]) => {
          if (cas && cas.length > 0) { // if has existing application, load it into the form
            const ca = cas[0];
            this.application = ca;
          } else {
            // pass
          }
        });
      }
    });
  }

  ngOnInit() {
  }


  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


}

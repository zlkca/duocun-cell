import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { NgRedux } from '../../../../node_modules/@angular-redux/store';
import { IAppState } from '../../store';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '../../../../node_modules/@angular/material';
import { takeUntil } from '../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../node_modules/rxjs';
import { CommandActions } from '../../shared/command.actions';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { AccountService } from '../../account/account.service';
import { IAccount } from '../../account/account.model';


export interface DialogData {
  title: string;
  content: string;
  buttonTextNo: string;
  buttonTextYes: string;
  accountId: string; // driver id
  accountName: string; // driver name
  orderId: string;
  total: number;
  paymentMethod: string;
  chargeId: string;
  transactionId: string;
}

@Component({
  selector: 'app-term-dialog',
  templateUrl: './term-dialog.component.html',
  styleUrls: ['./term-dialog.component.scss']
})
export class TermDialogComponent implements OnInit, OnDestroy {

  order;
  form;

  nOrders;
  owe;
  paid;

  receivable: number;
  onDestroy$ = new Subject();

  constructor(
    private rx: NgRedux<IAppState>,
    private accountSvc: AccountService,
    // private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TermDialogComponent>,
    // public dialogSvc: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    dialogRef.disableClose = true;

  }

  get received() { return this.form.get('received'); }
  get note() { return this.form.get('note'); }

  ngOnInit() {
    const self = this;

    if (this.data) {
      // this.accountSvc.quickFind({ _id: this.order.clientId }).pipe(takeUntil(self.onDestroy$)).subscribe((accounts: IAccount[]) => {
      //   const balance = accounts[0].balance;
      //   this.receivable = balance < 0 ? -balance : 0;
      // });
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onOk(): void {
    this.dialogRef.close();
  }
}

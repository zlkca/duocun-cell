import { IAccount } from '../account/account.model';
import { ILocation } from '../location/location.model';

export interface IContact {
  _id?: string;
  accountId?: string;
  username?: string;
  phone?: string;
  // account: IAccount;
  placeId?: string; // doesn't exist
  location?: ILocation; // in db
  address?: string;     // in db
  unit?: string;
  buzzCode?: string;
  verificationCode?: string; // in db
  created?: string;
  modified?: string;
  verified?: boolean;
}

export class Contact implements IContact {
  _id?: string;
  accountId: string;
  username: string;
  phone: string;
  // account: IAccount;
  unit: string;
  placeId: string; // doesn't exist
  location: ILocation;
  address: string;
  buzzCode: string;
  verificationCode: string;
  created?: string;
  modified?: string;
  verified?: boolean;

  constructor(data?: IContact) {
    Object.assign(this, data);
  }
}

export enum CellApplicationStatus {
  APPLIED = 1,    // submit application form but didn't submit setup fee page
  ORDERED,        // submit setup fee page but unpaid
  SETUP_PAID,     // paid setup fee
  STARTED,          // start to charge monthly fee
  STOPPED,          // start to charge monthly fee
}

export interface ICellApplication {
  _id?: string;       // in db
  accountId?: string; // in db
  firstName?: string; // in db
  lastName?: string;  // in db
  address?: string;   // in db
  phone?: string;     // in db
  status?: CellApplicationStatus;    // in db
  verified?: boolean;        // not in db
  verificationCode?: string; // not in db
}


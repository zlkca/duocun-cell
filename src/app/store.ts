import { Action } from 'redux';
import { combineReducers } from 'redux';
import { accountReducer } from './account/account.reducer';
// import { pictureReducer } from './commerce/commerce.reducers';
import { locationReducer } from './location/location.reducer';
import { ILocation } from './location/location.model';
// import { IPicture, DEFAULT_PICTURE } from './commerce/commerce.actions';
import { pageReducer } from './main/main.reducers';
import { commandReducer, ICommand } from './shared/command.reducers';
import { IDelivery, IDeliveryTime } from './delivery/delivery.model';
import { deliveryReducer } from './delivery/delivery.reducer';
import { IContact } from './contact/contact.model';
import { contactReducer } from './contact/contact.reducer';

import { Account } from './account/account.model';
import { deliveryTimeReducer } from './delivery/delivery-time.reducer';

export interface IAppState {
    account: Account;
    // picture: IPicture;
    location: ILocation;
    page: string;
    cmd: ICommand;
    deliveryTime: IDeliveryTime;
    delivery: IDelivery;
    contact: IContact;
}

export const INITIAL_STATE: IAppState = {
    account: null,
    // picture: DEFAULT_PICTURE,
    location: null,
    page: 'home',
    cmd: {name: '', args: ''},
    deliveryTime: {text: '', from: null, to: null},
    delivery: null,
    contact: null,
};

export const rootReducer = combineReducers({
    account: accountReducer,
    // picture: pictureReducer,
    location: locationReducer,
    page: pageReducer,
    cmd: commandReducer,
    deliveryTime: deliveryTimeReducer,
    delivery: deliveryReducer,
    contact: contactReducer
});

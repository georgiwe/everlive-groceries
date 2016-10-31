import { Injectable } from "@angular/core";
// import { getString, setString } from "application-settings";
import { Item } from './everlive-interfaces';
import Everlive from "everlive-sdk";

const appId = "1duiu8yp6l0bz342"; // TODO get from config

Injectable()
export class BackendService {
  _instance: Everlive;

  constructor() {
    this._instance = new Everlive({ appId: appId, schema: 'https', offline: true });
  }

  getDataObject<T extends Item>(collectionName: string) {
    return this._instance.data<T>(collectionName);
  }

  get userManagement() {
    return this._instance.users;
  }

  getNewQuery() {
    return new Everlive.Query();
  }

  isLoggedIn(): Promise<boolean> {
    return this._instance.authentication.getAuthenticationStatus()
      .then(statusInfo => statusInfo.status === Everlive.Constants.AuthStatus.authenticated, err => false);
  }
}

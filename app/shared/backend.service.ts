import { Injectable } from '@angular/core';

import { Item } from './everlive-interfaces';
import Everlive from 'everlive-sdk';

const appId = 'GWfRtXi1Lwt4jcqK';

const everliveOptions = {
  appId: appId,
  offline: true,
  authentication: {
    persist: true
  }
};

Injectable()
export class BackendService {
  private instance: Everlive;

  constructor() {
    this.instance = new Everlive(everliveOptions);
  }

  getDataObject<T extends Item>(collectionName: string) {
    return this.instance.data<T>(collectionName);
  }

  get userManagement() {
    return this.instance.users;
  }

  getNewQuery() {
    return new Everlive.Query();
  }

  isLoggedIn(): Promise<boolean> {
    return this.instance.authentication.getAuthenticationStatus()
      .then(statusInfo => statusInfo.status === Everlive.Constants.AuthStatus.authenticated, err => false);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Config } from './config';
// import * as ModelMapper from './model-mapper';

import * as Everlive from 'everlive-sdk';

// import { Grocery } from './grocery/grocery';
import './grocery/grocery'; // fix

export interface EverliveCredentials {
  username: string;
  password: string;
}

export interface EverliveConfig {
  appId: string
}

export interface EverliveDataCreationResponse {
  result: { Id: string, CreatedAt: Date };
}

export interface EverliveDataDeleteResponse {
  result: number;
}

export interface EverliveDataGetResponse<T> {
  result: T[];
  count?: number;
}

export interface EverliveDataUpdateResponse {
  result: number;
  modifiedAt: Date;
}

export interface EverliveData<T> {
  get(): Promise<EverliveDataGetResponse<T>>;
  create(grocery: T): Promise<EverliveDataCreationResponse>;
  deleteSingle(identifier: T): Promise<EverliveDataDeleteResponse>;
  deleteSingle(identifier: string): Promise<EverliveDataDeleteResponse>;
  updateSingle(identifier: T): Promise<EverliveDataUpdateResponse>;
}

@Injectable()
export class EverliveWrapper {
  private _everlive;

  // constructor(appId: string);
  // constructor(config: EverliveConfig);
  // constructor(obj?: string|EverliveConfig) {
  //     this._everlive = new Everlive(Config.appId);
  // }
  constructor() {
    this._everlive = new Everlive(Config.appId);
  }

  login(credentials: EverliveCredentials): Promise<any> {
    return this._everlive.authentication.login(credentials.username, credentials.password);
  }

  data<T>(collectionName: string): EverliveData<T> {
    return {
      get: () => this._everlive.data(collectionName).get(),
      create: (grocery: T) => this._everlive.data(collectionName).create(grocery),
      deleteSingle: (identifier: string | T) => this._everlive.data(collectionName).destroySingle(identifier),
      updateSingle: (identifier: T) => this._everlive.data(collectionName).updateSingle(identifier)
    };
  }
}

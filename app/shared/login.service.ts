import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Data, Users } from './everlive-interfaces';

import { User } from "./user.model";
import { BackendService } from "./backend.service";

@Injectable()
export class LoginService {
  private userManagement: Users;
  constructor(private http: Http, private everliveService: BackendService) {
    this.userManagement = this.everliveService.userManagement;
  }

  register(user: User) {
    let userInfo = {
      DisplayName: user.displayName,
      Email: user.email
    };
    console.log('register called: ' + JSON.stringify(userInfo));
    let registerPromise = this.userManagement.register(user.email, user.password, userInfo)
      .then(this.handleErrors, this.handleErrors);
    return Observable.fromPromise(registerPromise)
      .catch(this.handleErrors);
  }

  login(user: User) {
    let loginPromise = this.userManagement.login(user.email, user.password);
    return Observable.fromPromise(loginPromise)
      .catch(this.handleErrors);
  }

  logoff() {
    return Observable.fromPromise(this.userManagement.logout())
      .catch(this.handleErrors);
  }


  resetPassword(username: string) {
    return Observable.fromPromise(this.userManagement.resetPassword({ Username: username }))
      .catch(this.handleErrors);
  }

  handleErrors(error) {
    console.log(JSON.stringify(error));
    return Promise.reject(error.message);
  }
}

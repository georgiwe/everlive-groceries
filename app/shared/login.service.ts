import { Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";

import { Users } from './everlive-interfaces';

import { User } from "./user.model";
import { BackendService } from "./backend.service";

@Injectable()
export class LoginService {
  private userManagement: Users;

  constructor(private everliveService: BackendService) {
    this.userManagement = this.everliveService.userManagement;
  }

  register(user: User) {
    let registerPromise = this.userManagement.register(user.email, user.password, null);

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
    let resetPasswordPromise = this.userManagement.resetPassword({ Username: username });
    return Observable.fromPromise(resetPasswordPromise)
      .catch(this.handleErrors);
  }

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}

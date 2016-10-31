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
    let registerPromise = this.userManagement.register(user.email, user.password, userInfo);
      // .then(this.handleErrors, this.handleErrors);
    return Observable.fromPromise(registerPromise)
      .catch(this.handleErrors);
  }

  login(user: User) {
    let loginPromise = this.userManagement.login(user.email, user.password);
    return Observable.fromPromise(loginPromise)
      .catch(this.handleErrors);
  }

  /*  login(user: User) {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
  
      return this.http.post(
        BackendService.apiUrl + "oauth/token",
        JSON.stringify({
          username: user.email,
          password: user.password,
          grant_type: "password"
        }),
        { headers: headers }
      )
      .map(response => response.json())
      .do(data => {
        BackendService.token = data.Result.access_token;
      })
      .catch(this.handleErrors);
    }
    */

  logoff() {
    return Observable.fromPromise(this.userManagement.logout())
      .catch(this.handleErrors);
  }

  resetPassword(username: string) {
    return Observable.fromPromise(this.userManagement.resetPassword({ Username: username }))
      .catch(this.handleErrors);
  }

  /*
    logoff_alt() {
      BackendService.token = "";
    }
  
    resetPassword_alt(email) {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
  
      return this.http.post(
        BackendService.apiUrl + "Users/resetpassword",
        JSON.stringify({
          Email: email
        }),
        { headers: headers }
      )
      .catch(this.handleErrors);
    }*/

  handleErrors(error: Response) {
    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}
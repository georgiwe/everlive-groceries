import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { User } from "./user";
import { Config } from "../config";
import { Observable } from "rxjs/Rx";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { EverliveWrapper } from '../everlive';

@Injectable()
export class UserService {
  constructor(private _http: Http, private _backend: EverliveWrapper) {}

  register(user: User): Observable<Response> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this._http.post(
      Config.apiUrl + "Users",
      JSON.stringify({
        Username: user.email,
        Email: user.email,
        Password: user.password
      }),
      { headers: headers }
    )
    .catch(this.handleErrors);
  }

  login(user: User): Observable<Response> {
    let promise = this._backend.login({ username: user.email, password: user.password });
    return Observable.fromPromise(promise).catch(this.handleErrors);
  }

  handleErrors(error: Response): ErrorObservable {
    return Observable.throw(error);
  }
}
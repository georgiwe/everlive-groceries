import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Config} from "../config";
import {Grocery} from "./grocery";
import {Observable} from "rxjs/Rx";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import "rxjs/add/operator/map";

@Injectable()
export class GroceryListService {
  constructor(private _http: Http) {}

  load(): Observable<Grocery[]> {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + Config.token);

    return this._http.get(Config.apiUrl + "Groceries", {
      headers: headers
    })
    .map(res => res.json())
    .map(data => {
      let groceryList = [];
      data.Result.forEach((grocery) => {
        groceryList.push(new Grocery(grocery.Id, grocery.Name));
      });
      return groceryList;
    })
    .catch(this.handleErrors);
  }

  add(name: string): Observable<Grocery> {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + Config.token);
    headers.append("Content-Type", "application/json");

    return this._http.post(
      Config.apiUrl + "Groceries",
      JSON.stringify({ Name: name }),
      { headers: headers }
    )
    .map(res => res.json())
    .map(data => {
      return new Grocery(data.Result.Id, name);
    })
    .catch(this.handleErrors);
  }

  delete(id: string) {
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + Config.token);
    headers.append("Content-Type", "application/json");

    return this._http.delete(
      Config.apiUrl + "Groceries/" + id,
      { headers: headers }
    )
    .map(res => res.json())
    .catch(this.handleErrors);
  }

  handleErrors(error: Response): ErrorObservable {
    return Observable.throw(error);
  }
}
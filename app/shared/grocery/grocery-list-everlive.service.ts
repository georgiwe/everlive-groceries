import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
// import "rxjs/add/operator/map";

import { Config } from "../config";
import { Grocery } from "./grocery";
import { EverliveWrapper, EverliveData, EverliveDataDeleteResponse, EverliveDataUpdateResponse } from '../everlive';

@Injectable()
export class GroceryListService {
  private groceriesData: EverliveData<Grocery>;
  
  constructor(private _everlive: EverliveWrapper) {
    this.groceriesData = this._everlive.data<Grocery>('Groceries');
  }

  load(): Promise<Grocery[]> {
    return this.groceriesData.get().then((res) => res.result);
  }

  add(name: string): Promise<Grocery> {
    let newGrocery = new Grocery(null, name);
    
    return this.groceriesData.create(newGrocery).then((res) => {
      newGrocery.Id = res.result.Id;
      return newGrocery;
    });
  }

  delete(id: string): Promise<EverliveDataDeleteResponse> {
    return this.groceriesData.deleteSingle(id);
  }

  update(grocery: Grocery): Promise<EverliveDataUpdateResponse> {
    return this.groceriesData.updateSingle(grocery);
  }

  // handleErrors(error: Response): ErrorObservable {
  //   return Observable.throw(error);
  // }
}

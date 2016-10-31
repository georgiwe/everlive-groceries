import { Injectable, NgZone } from "@angular/core";
import { Http, Headers, Response, ResponseOptions } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Data, GroceryEntry } from '../../shared/everlive-interfaces';

import { BackendService } from "../../shared";
import { Grocery } from "./grocery.model";

@Injectable()
export class GroceryService {
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);

  private allItems: Array<Grocery> = [];
  private groceryData: Data<GroceryEntry>;

  constructor(private http: Http, private zone: NgZone, private backendService: BackendService) {
    this.groceryData = this.backendService.getDataObject<GroceryEntry>('Groceries');
  }

  load() {
    let query = this.backendService.getNewQuery();
    query.orderDesc('ModifiedAt');

    let loadPromise = this.groceryData.get(query)
      .then(data => {
        this.allItems = data.result.map(e => new Grocery(e.Id, e.Name, e.Done, e.Deleted));
        this.publishUpdates();
      });

    return Observable.from(loadPromise)
      .catch(this.handleErrors);
  }

  add(name: string) {
    let createPromise = this.groceryData.create({ Name: name })
      .then(res => {
        this.allItems.unshift(new Grocery(res.result.Id, name));
        this.publishUpdates();
      });

    return Observable.from(createPromise)
      .catch(this.handleErrors);
  }

  setDeleteFlag(item: Grocery) {
    return this.put(item.id, { Deleted: true, Done: false })
      .map(res => res.json())
      .map(data => {
        item.deleted = true;
        item.done = false;
        this.publishUpdates();
      });
  }

  toggleDoneFlag(item: Grocery) {
    item.done = !item.done;
    this.publishUpdates();
    return this.put(item.id, { Done: !item.done })
      .map(res => res.json());
  }

  restore() {
    let ids = [];
    this.allItems.forEach((grocery) => {
      if (grocery.deleted && grocery.done) {
        ids.push(grocery.id);
      }
    });

    let filter = {
      'Id': { '$in': ids }
    };
    let updateObj = {
      Deleted: false,
      Done: false
    };

    let updatePromise = this.groceryData.update(updateObj, filter)
      .then(res => {
        this.allItems.forEach((grocery) => {
          if (grocery.deleted && grocery.done) {
            grocery.deleted = false;
            grocery.done = false;
          }
        });
      });
    return Observable.fromPromise(updatePromise)
      .catch(this.handleErrors);
  }

  private put(id: string, data: any) {
    data = data || {};
    data.Id = id;
    let updatePromise = this.groceryData.updateSingle(data);
    return Observable.fromPromise(updatePromise)
      .catch(this.handleErrors);
  }

  // private updateSingleItem(item: Grocery, newItem: Grocery) {
  //   const index = this.allItems.indexOf(item);
  //   this.allItems.splice(index, 1, newItem);
  // }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      this.items.next([...this.allItems]);
    });
  }

  // private getHeaders() {
  //   let headers = new Headers();
  //   headers.append("Content-Type", "application/json");
  //   return headers;
  // }

  private handleErrors(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}
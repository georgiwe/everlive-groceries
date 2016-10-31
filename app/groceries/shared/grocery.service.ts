import { Injectable, NgZone } from "@angular/core";
import { Http, Headers, Response, ResponseOptions } from "@angular/http";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import "rxjs/add/operator/map";

import { Data } from '../../shared/everlive-interfaces';

import { BackendService } from "../../shared";
import { Grocery } from "./grocery.model";

@Injectable()
export class GroceryService {
  items: BehaviorSubject<Array<Grocery>> = new BehaviorSubject([]);

  private allItems: Array<Grocery> = [];
  private groceryData: Data<Grocery>;

  constructor(private http: Http, private zone: NgZone, private backendService: BackendService) {
    this.groceryData = this.backendService.getDataObject<Grocery>('Groceries');
  }

  load() {
    let query = this.backendService.getNewQuery();
    query.orderDesc('ModifiedAt');

    let loadPromise = this.groceryData.get(query)
      .then(data => {
        this.allItems = data.result;
        this.publishUpdates();
        return this.allItems;
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
    // TODO: fix
    console.log('set delete: ' + JSON.stringify(item));
    return this.put(item.Id, { Deleted: true, Done: false })
      .map(res => res.json())
      .map(data => {
        item.Deleted = true;
        item.Done = false;
        this.publishUpdates();
      });
  }

  toggleDoneFlag(item: Grocery) {
    // TODO: fix
    console.log('set done: ' + JSON.stringify(item));
    item.Done = !item.Done;
    this.publishUpdates();
    return this.put(item.Id, { Done: !item.Done })
      .map(res => res.json());
  }

  restore() {
    let ids = [];
    this.allItems.forEach((grocery) => {
      if (grocery.Deleted && grocery.Done) {
        ids.push(grocery.Id);
      }
    });

    let filter = {
      'Id': { '$in': ids }
    };
    let updateObj = { Deleted: false, Done: false };

    let updatePromise = this.groceryData.update(updateObj, filter)
      .then(res => {
        this.allItems.forEach((grocery) => {
          if (grocery.Deleted && grocery.Done) {
            grocery.Deleted = false;
            grocery.Done = false;
          }
        });
      });
    return Observable.fromPromise(updatePromise)
      .catch(this.handleErrors);
  }

  private put(id: string, data: any) {
    data.Id = id;
    console.log('put: ' + JSON.stringify(data));
    let updatePromise = this.groceryData.updateSingle(data);
    return Observable.fromPromise(updatePromise)
      .catch(this.handleErrors);
  }

  private publishUpdates() {
    // Make sure all updates are published inside NgZone so that change detection is triggered if needed
    this.zone.run(() => {
      // must emit a *new* value (immutability!)
      this.items.next([...this.allItems]);
    });
  }

  private handleErrors(error: Response) {
    console.log(error);
    return Observable.throw(error);
  }
}
import { DataItem } from '../../shared/data-item.model';

export class Grocery extends DataItem {
  Id: string;
  Name: string;
  Done: boolean;
  Deleted: boolean;

  constructor(id: string, name: string, done = false, deleted = false) {
    super();
    // this.Id = this.id;
    this.Name = name;
    this.Done = done;
    this.Deleted = deleted;
  }
}

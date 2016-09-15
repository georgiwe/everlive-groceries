import { Component, ElementRef, OnInit, ViewChild, NgZone } from "@angular/core";
import { Grocery } from "../../shared/grocery/grocery";
import { GroceryListService } from "../../shared/grocery/grocery-list-everlive.service";
import { TextField } from "ui/text-field";

@Component({
  selector: "list",
  providers: [GroceryListService],
  templateUrl: "pages/list/list.html",
  styleUrls: ["pages/list/list-common.css", "pages/list/list.css"]
})
export class ListPage implements OnInit {
  private groceryList: Array<Grocery> = [];
  private groceryName = '';
  private isLoading = false;
  private listLoaded = false;
  private groceryToUpdate: Grocery = null;
  @ViewChild("groceryTextField") groceryTextField: ElementRef;

  constructor(private _groceryListService: GroceryListService, private _zone: NgZone) {}

  onTap(): void {
    if (this.groceryName.trim() === "") {
      alert("Enter a grocery item");
      return;
    }

    // Dismiss the keyboard
    let textField = <TextField>this.groceryTextField.nativeElement;
    textField.dismissSoftInput();

    if (this.groceryToUpdate) {
      this.update();
    } else {
      this.add();
    }
  }

  add(): void {
    this._groceryListService.add(this.groceryName)
      .then(grocery => {
        this.groceryList.unshift(grocery);
        this.groceryName = "";
      }, () => {
        alert({
          message: "An error occurred while adding an item to your list.",
          okButtonText: "OK"
        });

        this.groceryName = "";
      });
  }

  delete(grocery: Grocery): void {
    this._groceryListService.delete(grocery.Id)
      .then((res) => {
        let ind = this.groceryList.indexOf(grocery);
        this.spliceList(ind, 1);
      }, (err) => alert(JSON.stringify(err.message)));
  }

  update() {
    let updateModel = new Grocery(this.groceryToUpdate.Id, this.groceryName);
    this._groceryListService.update(updateModel).then((res) => {
      this._zone.run(() => {
        let ind = this.groceryList.indexOf(this.groceryToUpdate);
        this.spliceList(ind, 1, [updateModel]);
        this.toggleUpdate(null);
      });
    });
  }

  toggleUpdate(grocery: Grocery): void {
    if (this.groceryToUpdate) {
      this.groceryToUpdate = null;
      this._zone.run(() => {
        this.groceryName = '';
      });
    } else {
      this.groceryToUpdate = grocery;
      this._zone.run(() => {
        this.groceryName = grocery.Name;
      });
    }
  }

  spliceList(ind: number, count: number, insert?: Grocery[]): void {
    this._zone.run(() => {
      this.groceryList.splice(ind, count, ...(insert || []));
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this._groceryListService.load().then((groceries) => {
      this.groceryList = groceries.reverse();
      this.isLoading = false;
      this.listLoaded = true;
    }, (err) => {
      alert({
        message: "An error occurred while loading groceries: " + err.message,
        okButtonText: "OK"
      });
    });
  }
}

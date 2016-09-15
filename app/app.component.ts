import { Component } from "@angular/core";
import { NS_ROUTER_DIRECTIVES } from "nativescript-angular/router";

import { EverliveWrapper } from './shared/everlive';

@Component({
  selector: "main",
  providers: [EverliveWrapper],
  directives: [NS_ROUTER_DIRECTIVES],
  template: "<page-router-outlet></page-router-outlet>"
})
export class AppComponent {}
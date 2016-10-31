import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { BackendService } from "./shared/backend.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private backendService: BackendService) { }

  canActivate() {
    return this.backendService.isLoggedIn().then(isAuthenticated => {
      if (!isAuthenticated) {
        this.router.navigate(["/login"]);
      }
      return isAuthenticated;
    });
  }
}

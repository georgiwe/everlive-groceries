import { DataItem } from './data-item.model';

const validator = require("email-validator");

export class User extends DataItem {
  username:string;
  displayName:string;
  email: string;
  password: string;
  isValidEmail() {
    return validator.validate(this.email);
  }
}

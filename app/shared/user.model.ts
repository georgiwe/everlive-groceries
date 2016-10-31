const validator = require("email-validator");

export class User {
  username:string;
  displayName:string;
  email: string;
  password: string;
  isValidEmail() {
    return validator.validate(this.email);
  }
}

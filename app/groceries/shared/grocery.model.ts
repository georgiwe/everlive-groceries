export class Grocery {
  constructor(
    public id: string,
    public name: string,
    public done = false,
    public deleted = false) {}
}

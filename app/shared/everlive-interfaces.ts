export * from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/Item';
export * from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';
export * from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Users';

import { Item } from './everlive-interfaces';

// This interface represents a Grocery entry in the database
// The difference with the Grocery model is the casing of its property names
// If they matched in the database and the model, this interface would not be necessary
export interface GroceryEntry extends Item {
    Id: string;
    Name: string;
    Done: boolean;
    Deleted: boolean;
}

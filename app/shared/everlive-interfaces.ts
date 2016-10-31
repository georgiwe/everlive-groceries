export * from '../../node_modules/everlive-sdk/dist/declarations/everlive/interfaces/Item';
export * from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Data';
export * from '../../node_modules/everlive-sdk/dist/declarations/everlive/types/Users';

import { Item } from './everlive-interfaces';

export interface GroceryEntry extends Item {
    Id: string;
    Done: boolean;
    Deleted: boolean;
    Name: string;
}

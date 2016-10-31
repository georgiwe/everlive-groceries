import { Item } from './everlive-interfaces';

export class DataItem implements Item {
    CreatedAt: Date;
    CreatedBy: string;
    Id: string;
    Meta: {
        Permissions: {
            CanDelete: boolean;
            CanRead: boolean;
            CanUpdate: boolean;
        };
    };
    ModifiedAt: Date;
    ModifiedBy: string;
    Owner: string;
    Role: string;
}

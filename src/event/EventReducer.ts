import {NotificationProps} from "../notification/Notifications";

export type EventType = "REPOSITORY_ITEM_SELECTED" |
    "REPOSITORY_ITEM_DESELECTED" |
    "LIST_ITEM_DELETED" |
    "ITEM_UPSERT" |
    "ERROR_EVENT" |
    null;

export interface FocusableEventData {
    focus?: boolean
}

export interface RepositoryItemEventData extends FocusableEventData{
    id?: string
}

export interface ListItemDeletedEventData {
    id: string,
    notification: NotificationProps
}

export interface ItemUpsertedEventData extends FocusableEventData {
    id?:string;
    upsertedResource: string;
}

export type EventState = {
    type: EventType;
    data?: RepositoryItemEventData|ListItemDeletedEventData|ItemUpsertedEventData;
};

export type EventAction = {
    type: EventType;
    payload?: RepositoryItemEventData|ListItemDeletedEventData|ItemUpsertedEventData;
}

export const eventReducer = (state: EventState, action: EventAction): EventState => {
    return action.type ?
        {
            type: action.type,
            data: action.payload
        } :
        {
            type: null
        };
}

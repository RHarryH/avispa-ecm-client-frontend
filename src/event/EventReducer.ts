import {NotificationProps} from "../notification/Notifications";

export type EventType = "REPOSITORY_ITEM_SELECTED" |
    "REPOSITORY_ITEM_DESELECTED" |
    "LIST_ITEM_DELETED" |
    null;

export interface FocusableEventData {
    focus?: boolean
}

export interface RepositoryItemEventData extends FocusableEventData{
    id?: string
}

export interface ListItemDeletedData {
    id: string,
    notification: NotificationProps
}

export type EventState = {
    type: EventType;
    data?: RepositoryItemEventData|ListItemDeletedData;
};

export type EventAction = {
    type: EventType;
    payload?: RepositoryItemEventData|ListItemDeletedData;
}

export const eventReducer = (state: EventState, action: EventAction): EventState => {
    switch (action.type) {
        case 'REPOSITORY_ITEM_SELECTED':
        case "REPOSITORY_ITEM_DESELECTED":
        case 'LIST_ITEM_DELETED':
            return {
                type: action.type,
                data: action.payload
            };
        default:
            return {
                type: null
            };
    }
}

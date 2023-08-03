export type EventType = "REPOSITORY_ITEM_SELECTED" |
    "REPOSITORY_ITEM_DESELECTED" |
    null;

export type EventState = {
    type: EventType;
    id: string;
}

export type EventAction = {
    type: EventType;
    payload: string;
}

export const eventReducer = (state:EventState, action: EventAction): EventState => {
    switch (action.type) {
        case 'REPOSITORY_ITEM_SELECTED':
        case "REPOSITORY_ITEM_DESELECTED":
            return {
                type: action.type,
                id: action.payload
            };
        default:
            return {
                type: null,
                id: ""
            }
    }
}

/*
 * Avispa ECM Client Frontend
 * Copyright (C) 2023 Rafał Hiszpański
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {createContext, Dispatch, useContext, useEffect} from "react";
import {EventAction, EventState, EventType} from "./EventReducer";

interface ContextProps {
    state: EventState
    publishEvent: Dispatch<EventAction>
}

const EventContext = createContext({} as ContextProps);

export function useEventContext() {
    return useContext(EventContext)
}

export function useEventListener(events: EventType[], handle: (state:EventState) => void) {
    const {state} = useEventContext();

    useEffect(() => {
        if (state?.type && events.includes(state.type)) {
            handle(state);
        }
    }, [state]);
}

export default EventContext;
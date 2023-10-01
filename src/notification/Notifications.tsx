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

import React, {useState} from "react";
import {ToastContainer} from "react-bootstrap";
import Notification, {NotificationType} from "./Notification";
import {useEventListener} from "../event/EventContext";
import {ListItemDeletedEventData} from "../event/EventReducer";

export interface NotificationProps {
    type: NotificationType;
    message: string
}

interface NewNotification {
    id: number;
    notification: NotificationProps;
}

function Notifications() {
    const [notifications, setNotifications] = useState<NewNotification[]>([]);
    const addNotification = (newNotification: NewNotification) =>
        setNotifications((notifications) => [...notifications, newNotification]);
    const removeNotification = (id: number) =>
        setNotifications((notifications) => notifications.filter((e) => e.id !== id));

    useEventListener(["LIST_ITEM_DELETED"], (state) => {
        const data = state.data as ListItemDeletedEventData;
        addNotification({
            id: Math.random(),
            notification: data.notification
        });
    });

    return (
        <div aria-live="polite" aria-atomic="true">
            <ToastContainer className="position-fixed p-3 mb-5" position="bottom-end" style={{ zIndex: 1 }}>
                {notifications.map(({ id, notification }) => (
                    <Notification key={id} {...notification} onRemove={() => removeNotification(id)} />
                ))}
            </ToastContainer>
        </div>
    );
}

export default Notifications;
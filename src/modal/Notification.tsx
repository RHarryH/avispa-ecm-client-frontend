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
import './Notification.css';
import {Toast} from "react-bootstrap";

export type NotificationType = "success"|"info"|"warning"|"error";

interface NotificationProps {
    type: NotificationType;
    message: string,
    onRemove: any
}

function Notification({type, message, onRemove}:NotificationProps) {
    const [show, setShow] = useState(true);

    function getHeaderTitle(type: NotificationType) {
        switch(type) {
            case "success":
                return "Success";
            case "info":
                return "Information";
            case "warning":
                return "Warning";
            case "error":
                return "Error";
        }
    }

    function getIconClass(type: NotificationType) {
        switch(type) {
            case "success":
                return "bi-check-circle-fill";
            case "info":
                return "bi-info-circle-fill";
            case "warning":
            case "error":
                return "bi-exclamation-triangle-fill";
        }
    }

    return (
        // TODO: wait for React Bootstrap update
        <Toast show={show} delay={5000} /*onExit={onRemove}*/ onClose={() => {setShow(false); onRemove();}} autohide>
            <Toast.Header className={type}>
                <strong className={"me-auto bi " + getIconClass(type)}>{'\u00A0' + getHeaderTitle(type)}</strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
        </Toast>
    );
}

export default Notification;
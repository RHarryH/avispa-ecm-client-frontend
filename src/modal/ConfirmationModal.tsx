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

import React, {useCallback} from "react";
import {Button, Modal} from "react-bootstrap";
import axios, {Method} from "axios";
import {useEventContext} from "../event/EventContext";
import {EventType} from "../event/EventReducer";

interface ActionProps {
    id: string,
    endpoint: string
    method : Method
    successMessage: string
    errorMessage: string
    eventType: EventType
}

interface ConfirmationModalProps {
    show: boolean
    title: string
    message: string
    action: ActionProps
    onClose: any
}

function ConfirmationModal({show, title, message, action, onClose}:ConfirmationModalProps) {
    const { publishEvent } = useEventContext();

    const runAction = useCallback(() => {
        axios(action.endpoint, {method: action.method})
            .then(() => {
                publishEvent({
                    type: action.eventType,
                    payload: {
                        id: action.id,
                        notification: {
                            type: 'success',
                            message: action.successMessage
                        }
                    }
                })
            })
            .catch(error => {
                publishEvent({
                    type: "ERROR_EVENT",
                    payload: {
                        id: action.id,
                        notification: {
                            type: 'error',
                            message: action.errorMessage + (error.response?.data ? ' Reason: ' + error.response.data.message : '')
                        }
                    }
                })
            })
            .finally(() => {
                onClose();
            })
    }, [action]);

    return (
        <>
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onClose}>
                        Reject
                    </Button>
                    <Button type="submit" variant="primary" onClick={runAction}>
                        Accept
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ConfirmationModal;
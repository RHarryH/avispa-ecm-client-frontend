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

import React, {useCallback, useEffect, useState} from "react";
import {Button, Col, Form, ListGroup, ListGroupItem, Modal, Row, Spinner} from "react-bootstrap";
import axios, {Method} from "axios";
import {useEventContext} from "../event/EventContext";
import {EventType} from "../event/EventReducer";
import {PropertyPageConfig} from "../interface/PropertyPageConfig";
import PropertyPage from "../propertypage/PropertyPage";
import Container from "react-bootstrap/Container";
import {getPropertyControl} from "../misc/Misc";

export type ModalType = "ADD" | "UPDATE" | "CLONE";

interface ActionProps {
    id?: string,
    endpoint: string
    method: Method
    successMessage: string
    errorMessage: string
    buttonValue: string
    eventType?: EventType
}

/*interface ModalData {
    type: ModalType
    title: string
    resource: string
    action?: ActionProps
    pages: ModalPage[]
    propertyPage: PropertyPageConfig
}*/

interface ModalData {
    type: ModalType
    title: string
    resource: string
    action?: ActionProps
    pages: ModalPage[]
}

interface ModalPage {
    name: string;
    propertyPageConfig?: string;
}

interface AdvancedModalProps {
    show: boolean,
    action: string,
    onClose: any
}

function AdvancedModal({show, action, onClose}: AdvancedModalProps) {
    const {publishEvent} = useEventContext();
    const [modalData, setModalData] = useState<ModalData>({
        title: "Default modal",
        type: "ADD",
        resource: "",
        pages: [
            {
                name: "Unknown page"
            }
        ]
    });
    const [propertyPage, setPropertyPage] = useState<PropertyPageConfig>({
        readonly: false,
        size: "small",
        controls: []
    });
    const [pageNumber, setPageNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(show) {
            setIsLoading(true);
            axios.get('/modal/' + action)
                .then(response => {
                    const modal = response.data;
                    setModalData(modal);
                    setPropertyPage(modal.propertyPage);
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [show]);

    const runAction = useCallback((event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (modalData.action) {
            const action = modalData.action;

            const data = new FormData(event.currentTarget);
            axios(action.endpoint, {
                method: action.method,
                data: data,
                headers: { "Content-Type": "multipart/form-data" }
            })
            .then(() => {
                publishEvent({
                    type: "ITEM_UPSERT",
                    payload: {
                        id: action.id,
                        focus: modalData.type === 'ADD',
                        upsertedResource: modalData.resource,
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
                             message: action.errorMessage + (error.response.data ? ' Reason: '  + error.response.data.message : '')
                         }
                     }
                 })
            })
            .finally(() => {
                onClose();
            })
        }
    }, [modalData]);

    function onChange(event: React.FormEvent<HTMLFormElement>) {
        const target: any = event.target;
        let propertyPageUpdated:PropertyPageConfig = {...propertyPage};

        //console.log("Changed property: " + target.name + "=>" + target.value);

        // update property in the property page
        let foundControl = getPropertyControl(target.name, propertyPageUpdated.controls);
        if(foundControl) {
            if(foundControl.index !== undefined) {
                //console.log(JSON.stringify(foundControl.control.value) + " " + Array.isArray(foundControl.control.value));
                foundControl.control.value[foundControl.index] = target.value;
            } else {
                foundControl.control.value = target.value;
            }
        }

        setPropertyPage(propertyPageUpdated);
    }

    return (
        <>
            <Modal show={show} on onHide={() => { onClose(); setPageNumber(0);}} centered size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>{modalData.title}</Modal.Title>
                </Modal.Header>
                <Container>
                    <Row>
                    {
                        isLoading ?
                            <Col>
                                <Modal.Body className="d-flex justify-content-center">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </Modal.Body>
                            </Col> :
                            <>
                                {
                                modalData.pages.length > 1 ?
                                    <Col lg="auto" className="p-0 border-end">
                                        <ListGroup variant="flush">
                                            {
                                                modalData.pages.map((page, index) => (
                                                    <ListGroupItem active={pageNumber === index} aria-current={pageNumber === index}>{page.name}</ListGroupItem>
                                                ))
                                            }
                                        </ListGroup>
                                    </Col>
                                    : null
                                }
                                <Col className="p-0">
                                    <Form onSubmit={runAction} onChange={event => onChange(event)}>
                                        <Modal.Body>
                                                <PropertyPage propertyPage={propertyPage}></PropertyPage>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            {
                                                modalData.pages.length > 1 && pageNumber > 0 ?
                                                    <Button type="submit" variant="primary" className="bi bi-caret-left-fill"
                                                            onClick={() => setPageNumber(pageNumber - 1)}> Previous</Button> :
                                                    null
                                            }
                                            {
                                                modalData.type === 'ADD' ?
                                                    <Button type="reset" variant="secondary">Reset</Button> :
                                                    null
                                            }
                                            <Button variant="danger" onClick={onClose}>Reject</Button>
                                            {
                                                pageNumber === modalData.pages.length - 1 ?
                                                    <Button type="submit" variant="primary">{modalData.action?.buttonValue ?? "Unknown action"}</Button>
                                                    : null
                                            }
                                            {
                                                modalData.pages.length > 1 && (pageNumber < modalData.pages.length - 1) ?
                                                    <Button type="submit" variant="primary" className="bi bi-caret-right-fill"
                                                            onClick={() => setPageNumber(pageNumber + 1)}> Next</Button> :
                                                    null
                                            }
                                        </Modal.Footer>
                                    </Form>
                                </Col>
                            </>
                    }
                    </Row>
                </Container>
            </Modal>
        </>
    );
}

export default AdvancedModal;
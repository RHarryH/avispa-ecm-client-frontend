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

import React, {ElementRef, useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, Form, ListGroup, ListGroupItem, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import axios, {Method} from "axios";
import {useEventContext} from "../event/EventContext";
import {EventType} from "../event/EventReducer";
import {ComboRadio, PropertyPageConfig, TableProps} from "../interface/PropertyPageConfig";
import PropertyPage from "../propertypage/PropertyPage";
import Container from "react-bootstrap/Container";
import {getControlsOfType, getPropertyControl} from "../misc/Misc";
import ErrorPage from "../misc/ErrorPage";
import {RestError} from "../widget/Widget";
import {runCustomValidation} from "../misc/Validation";
import LoadingScreen from "../LoadingScreen";

export type ModalType = "ADD" | "UPDATE" | "CLONE";
type ModalPageType = "SELECT_SOURCE" | "PROPERTIES";

interface ActionProps {
    id?: string,
    endpoint: string
    method: Method
    successMessage: string
    errorMessage: string
    buttonValue: string
    eventType?: EventType
}

interface ModalData {
    type: ModalType
    title: string
    resource: string
    action?: ActionProps
    pages: ModalPage[]
}

interface ModalPage {
    name: string
    pageType: ModalPageType
}

interface AdvancedModalProps {
    show: boolean
    action: string
    onClose: any
}

function AdvancedModal({show, action, onClose}: AdvancedModalProps) {
    const {publishEvent} = useEventContext();
    const formRef = useRef<ElementRef<"form">>(null);

    const [error, setError] = useState<RestError | undefined>(undefined);

    const onError = useCallback((error: RestError | undefined) => {
        setError(error);
    }, []);

    const [modalData, setModalData] = useState<ModalData>({
        title: "Default modal",
        type: "ADD",
        resource: "",
        pages: [
            {
                name: "Unknown page",
                pageType: "PROPERTIES"
            }
        ]
    });
    const [propertyPage, setPropertyPage] = useState<PropertyPageConfig>({
        context: "READONLY",
        size: "small",
        controls: []
    });
    const [initPropertyPage, setInitPropertyPage] = useState<PropertyPageConfig|undefined>(undefined);

    const [modalContext, setModalContext] = useState<FormData[]>([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const close = useCallback(() => {
        if (isProcessing) { // don't allow closing dialog when request is processing
            return;
        }

        setModalContext([]);
        setPageNumber(0);
        setError(undefined);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (show && pageNumber === 0) {
            setIsLoading(true);
            axios.get('/modal/' + action)
                .then(response => {
                    const modal = response.data;
                    setModalData(modal);

                    setPropertyPage(modal.propertyPage);
                    setInitPropertyPage(structuredClone(modal.propertyPage));
                })
                .catch(error => {
                    publishEvent({
                        type: "ERROR_EVENT",
                        payload: {
                            id: undefined,
                            notification: {
                                type: 'error',
                                message: "Can't load modal" + (error.response?.data ? ' Reason: ' + error.response.data.message : '')
                            }
                        }
                    });

                    close();
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [show, action, close, publishEvent]);

    const reset = useCallback(() => {
        setPropertyPage(structuredClone(initPropertyPage));
    }, [initPropertyPage]);

    const validateForm = useCallback((form: EventTarget & HTMLFormElement) => {
        Array.from(form.elements).forEach((element) => {
            if ('name' in element) {
                let input = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
                const foundControl = getPropertyControl(input.name, propertyPage.controls);
                if (foundControl?.control) {
                    runCustomValidation(foundControl?.control, input);
                }
            }
        });
    }, [propertyPage.controls])

    const runAction = useCallback((event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (modalData.action) {
            const form = event.currentTarget;

            // validate full form
            validateForm(form);
            if (!form.reportValidity()) {
                event.stopPropagation();
                return;
            }

            setIsProcessing(true)

            const action = modalData.action;

            const data = new FormData(form);
            axios(action.endpoint, {
                method: action.method,
                data: data,
                headers: { "Content-Type": "application/json" }
            })
            .then(() => {
                publishEvent({
                    type: "ITEM_UPSERT",
                    payload: {
                        id: action.id,
                        focus: modalData.type === 'ADD' || modalData.type === 'CLONE',
                        upsertedResource: modalData.resource,
                        notification: {
                            type: 'success',
                            message: action.successMessage
                        }
                    }
                })
                close();
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
                    setIsProcessing(false)
                })
        }
    }, [modalData, close, validateForm, publishEvent]);

    const loadPage = useCallback((newPageNumber: number) => {
        if(show && formRef.current && (pageNumber > 0 || pageNumber < modalData.pages.length)) {
            setIsLoading(true);

            const url = '/modal/page/' + modalData.resource;
            const targetPageType = modalData.pages[newPageNumber].pageType;

            let responsePromise;
            let newModalContext = structuredClone(modalContext);
            if(newPageNumber > pageNumber) {
                // does not allow to go forward if the form data is invalid
                if(!formRef.current.checkValidity()) {
                    setIsLoading(false);
                    formRef.current.reportValidity();
                    return;
                }

                const context = new FormData(formRef.current);
                const contextWrapper = new FormData();

                // wrap form data into modal context
                context.forEach((value, key) => contextWrapper.set("contextInfo." + key, value));
                contextWrapper.set("modalType", modalData.type);
                contextWrapper.set("sourcePageType", modalData.pages[pageNumber].pageType);
                contextWrapper.set("targetPageType", targetPageType);

                // update contexts array
                newModalContext.push(contextWrapper);

                responsePromise = axios.post(url, contextWrapper, {headers: { "Content-Type": "application/json" }});
            } else {
                // update contexts array by removing last context
                const previousPageContext = newModalContext.pop();

                // restore context of the previous page by providing it to the request
                if (previousPageContext) {
                    // when going back target page is the source page, source page is not required because current page
                    // does not determine the values of previous page
                    previousPageContext.set("targetPageType", previousPageContext.get("sourcePageType") as string);
                    previousPageContext.delete("sourcePageType");

                    responsePromise = axios.post(url, previousPageContext, {headers: {"Content-Type": "application/json"}});
                }
            }

            // if context for previous page is missing the page won't be loaded
            // therefore it is required to unlock the page
            // this should not happen in normal conditions
            if (!responsePromise) {
                setIsLoading(false);
                return;
            }

            responsePromise.then(response => {
                const propertyPage = response.data;

                setPropertyPage(propertyPage);
                setModalContext(newModalContext);
                setInitPropertyPage(structuredClone(propertyPage));
            }).catch(error => {
                if (error) {
                    onError(error);
                } else {
                    console.error(error.message);
                }
            })
            .finally(() => {
                setPageNumber(newPageNumber);
                setIsLoading(false);
            });
        }
    }, [modalData, show, pageNumber, modalContext, onError]);

    // update model on change of value in the form control
    function onChange(event: React.FormEvent<HTMLFormElement>) {
        const target = event.target as HTMLFormElement;

        // update property in the property page
        let propertyPageUpdated = structuredClone(propertyPage);
        let foundControl = getPropertyControl(target.name, propertyPageUpdated.controls);
        if(foundControl) {
            if(foundControl.index !== undefined) {
                foundControl.control.value[foundControl.index] = target.value;
            } else {
                foundControl.control.value = target.value;
            }

            //console.log("Changed property: " + target.name + "=>" + target.value);
        }

        function loadDictionaries() {
            let promises: Promise<void>[] = [];

            const context = new FormData(event.currentTarget);

            getControlsOfType(['combo', 'radio'], propertyPageUpdated.controls)
                .map(control => control as ComboRadio)
                .forEach(comboRadio => {
                    const contextWrapper = new FormData();

                    if (comboRadio.loadSettings?.qualification) {

                        // wrap form data into modal context
                        context.forEach((value, key) => contextWrapper.set("object." + key, value));
                        contextWrapper.set("qualification", comboRadio.loadSettings.qualification);

                        promises.push(axios.post('/dictionary/' + comboRadio.loadSettings.type, contextWrapper, {headers: {"Content-Type": "application/json"}})
                            .then(response => {
                                comboRadio.options = response.data;
                            })
                            .catch(error => {
                                publishEvent({
                                    type: "ERROR_EVENT",
                                    payload: {
                                        id: undefined,
                                        notification: {
                                            type: 'error',
                                            message: "Can't reload dictionary" + (error.response?.data ? ' Reason: ' + error.response.data.message : '')
                                        }
                                    }
                                });
                            }));
                    }
                });
            return promises;
        }

        // wait until all dictionaries will be reloaded before updating the property page value
        Promise.all(loadDictionaries()).then(() => {
            setPropertyPage(propertyPageUpdated);
        });
    }

    function onTableRowAdded(propertyName: string) {
        let propertyPageUpdated:PropertyPageConfig = {...propertyPage};

        let foundControl = getPropertyControl(propertyName, propertyPageUpdated.controls);
        if(foundControl && foundControl.control.type === 'table') {
            const table = foundControl.control as TableProps;
            table.controls.forEach(control => {
                // set default values
                if (control.type === 'number') {
                    control.value.push("0")
                } else if (control.type === 'money') {
                    control.value.push("0,00")
                } else {
                    control.value.push("")
                }
            });
            table.size++;

            setPropertyPage(propertyPageUpdated);
        }
    }

    function onTableRowRemoved(propertyName: string, index: number) {
        let propertyPageUpdated:PropertyPageConfig = {...propertyPage};

        let foundControl = getPropertyControl(propertyName, propertyPageUpdated.controls);
        if(foundControl && foundControl.control.type === 'table') {
            const table = foundControl.control as TableProps;
            table.controls.forEach(control => control.value.splice(index, 1));
            table.size--;

            setPropertyPage(propertyPageUpdated);
        }
    }

    const tooltip = (message:string) => (
        <Tooltip id="tooltip">
            {message}
        </Tooltip>
    );

    return (
        <>
            <Modal show={show} onHide={close} centered size="xl">
                <Modal.Header closeButton={!isProcessing}>
                    <Modal.Title>{error ? "Error page" : modalData.title}</Modal.Title>
                </Modal.Header>
                <Container>
                    <Row>
                        {
                            isLoading ?
                                <LoadingScreen/>
                                : (error ?
                                    <Col>
                                        <Modal.Body>
                                            <ErrorPage error={error} displayMessage="Page can't be loaded"
                                                       buttonMessage="Go back to the previous page"
                                                       onError={() => setError(undefined)}/>
                                        </Modal.Body>
                                    </Col>
                                    :
                                    <>
                                        {
                                            modalData.pages.length > 1 ?
                                                <Col lg="auto" className="p-0 border-end">
                                                    <ListGroup variant="flush">
                                                        {
                                                            modalData.pages.map((page, index) => (
                                                                <ListGroupItem key={crypto.randomUUID()}
                                                                               active={pageNumber === index}
                                                                               aria-current={pageNumber === index}>{page.name}</ListGroupItem>
                                                            ))
                                                        }
                                                    </ListGroup>
                                                </Col>
                                                : null
                                        }
                                        <Col className="p-0">
                                            <Form ref={formRef} onSubmit={runAction} onChange={onChange} noValidate>
                                                <Modal.Body>
                                                    <PropertyPage propertyPage={propertyPage}
                                                                  onTableRowAdded={onTableRowAdded}
                                                                  onTableRowRemoved={onTableRowRemoved}></PropertyPage>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    {
                                                        modalData.pages.length > 1 && pageNumber > 0 ?
                                                            <Button variant="primary" className="bi bi-caret-left-fill"
                                                                    disabled={isProcessing}
                                                                    onClick={() => loadPage(pageNumber - 1)}> Previous</Button> :
                                                            null
                                                    }
                                                    <OverlayTrigger placement="bottom"
                                                                    overlay={tooltip('Resets the content of this page')}>
                                                        <Button type="reset" variant="secondary" disabled={isProcessing}
                                                                onClick={reset}>Reset</Button>
                                                    </OverlayTrigger>
                                                    <Button variant="danger" disabled={isProcessing}
                                                            onClick={close}>Reject</Button>
                                                    {
                                                        pageNumber === modalData.pages.length - 1 ?
                                                            <Button type="submit" disabled={isProcessing}
                                                                    variant="primary">{modalData.action?.buttonValue ?? "Unknown action"}</Button>
                                                            : null
                                                    }
                                                    {
                                                        modalData.pages.length > 1 && (pageNumber < modalData.pages.length - 1) ?
                                                            <Button variant="primary" className="bi bi-caret-right-fill"
                                                                    disabled={isProcessing}
                                                                    onClick={() => loadPage(pageNumber + 1)}> Next</Button> :
                                                            null
                                                    }
                                                </Modal.Footer>
                                            </Form>
                                        </Col>
                                    </>)
                        }
                    </Row>
                </Container>
            </Modal>
        </>
    );
}

export default AdvancedModal;
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
import {Button, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import axios from "axios";
import {useEventListener} from "../event/EventContext";
import {ListItemDeletedEventData} from "../event/EventReducer";
import {processDownload} from "../misc/Misc";
import ConfirmationModal from "../modal/ConfirmationModal";
import AdvancedModal from "../modal/AdvancedModal";

interface ListData {
    id: string;
    values: any[];
}
interface ListDataProps {
    caption: string;
    resource: string;
    isDocument: boolean;
    emptyMessage: string;
    headers: string[];
}

interface ListWidgetProps {
    configuration?: string;
}

interface ModalProps {
    show: boolean;
    rowId?: string;
}

function ListWidget({configuration}:ListWidgetProps) {
    const [listWidgetData, setListWidgetData] = useState<ListDataProps>({
        caption: "",
        resource: "",
        isDocument: false,
        emptyMessage: "Empty list",
        headers: []
    });
    const [data, setData] = useState<ListData[]>([]);

    // delete modal
    const [deleteModalProps, setDeleteModalProps] = useState<ModalProps>({
        show: false
    });
    const handleDeleteModalShow = (rowId: string) => setDeleteModalProps({
        show: true,
        rowId: rowId
    });
    const handleDeleteModalClose = () => setDeleteModalProps({
        show: false
    });

    // update modal
    const [editModalProps, setEditModalProps] = useState<ModalProps>({
        show: false
    });
    const handleEditModalShow = (rowId: string) => setEditModalProps({
        show: true,
        rowId: rowId
    });
    const handleEditModalClose = () => setEditModalProps({
        show: false
    });

    useEventListener(["LIST_ITEM_DELETED"], (state) => {
        const eventData = state.data as ListItemDeletedEventData;
        const id = eventData.id;
        if(id) {
            setData(data.filter(row => row.id !== id));
        }
    });

    useEventListener(["ITEM_UPSERT"], () => {
        reloadData();
    });

    function fetchData() {
        axios.get<any>('/widget/list-widget/' + configuration)
            .then(response => {
                const widgetData = response.data;
                setListWidgetData(widgetData);
                setData(widgetData.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    useEffect(() => {
        return fetchData();
    }, []);

    const reloadData = useCallback(() => {
        return fetchData();
    }, []);

    const tooltip = (message:string) => (
        <Tooltip id="tooltip">
            {message}
        </Tooltip>
    );

    const getRendition = useCallback((rowId:string) => {
        axios.get(`/invoice/rendition/` + rowId, {responseType: 'blob'})
            .then(response => {
                processDownload(response);
            })
            .catch(function(error) {
                console.log(error);
            })
    }, []);

    return (
    <div className="py-3">
        <Button size="sm" variant="outline-dark" className="mb-2 bi bi-arrow-clockwise" onClick={reloadData}> Refresh</Button>
        <Table striped>
            <caption>{listWidgetData.caption}</caption>
            <thead>
                <tr>
                    {
                        listWidgetData.headers
                            .filter(header => header !== "pdfRenditionAvailable")
                            .map((header, index) => (<th key={index} scope="col">{header}</th>))
                    }
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                    {
                        listWidgetData.isDocument ?
                            <th scope="col">Download</th> :
                            null
                    }
                </tr>
            </thead>
            <tbody>
                {
                    !data.length ?
                        <tr><td colSpan={100}>{listWidgetData.emptyMessage}</td></tr> :
                        null
                }
                {
                    data
                        .map(row =>
                            (<tr key={row.id}>
                                {getValues(row.values)}
                                <td>
                                    <OverlayTrigger placement="bottom" overlay={tooltip('Edit ' + listWidgetData.resource)}>
                                        <Button variant="" value={row.id} className="bi bi-pencil-fill" onClick={() => handleEditModalShow(row.id)}></Button>
                                    </OverlayTrigger>
                                </td>
                                <td>
                                    <OverlayTrigger placement="bottom" overlay={tooltip('Delete ' + listWidgetData.resource)}>
                                        <Button variant="" value={row.id} className="bi bi-trash-fill" onClick={() => handleDeleteModalShow(row.id)}/>
                                    </OverlayTrigger>
                                </td>
                                {
                                    listWidgetData.isDocument ?
                                        (<td>
                                            {
                                                Object.keys(row.values).filter(key => key === "pdfRenditionAvailable").length ?
                                                    <OverlayTrigger placement="bottom" overlay={tooltip("Download PDF rendition")}>
                                                        <Button variant="" value={row.id} className="bi bi-file-earmark-arrow-down-fill" onClick={() => getRendition(row.id)}/>
                                                    </OverlayTrigger> :
                                                    <></>
                                            }
                                        </td>):
                                        null
                                }
                            </tr>))
                }
            </tbody>
        </Table>
        <AdvancedModal show={editModalProps.show} action={"update/" + listWidgetData.resource + "/" + editModalProps.rowId} onClose={handleEditModalClose}/>
        <ConfirmationModal show={deleteModalProps.show} title="Deletion" message={'Do you really want to delete this ' + listWidgetData.resource} onClose={handleDeleteModalClose} action={{
            id: deleteModalProps.rowId ?? '',
            method: "delete",
            endpoint: listWidgetData.resource + "/" + deleteModalProps.rowId,
            successMessage: listWidgetData.resource + ' deleted successfully!',
            errorMessage: 'Error when deleting ' + listWidgetData.resource + '!',
            eventType: "LIST_ITEM_DELETED"
        }}/>
    </div>);

    function getValues(values: any[]) {
        let result = [];
        for (const [key, value] of Object.entries(values)) {
            if(key !== "pdfRenditionAvailable") {
                result.push((<td key={key}>{value}</td>))
            }
        }

        return result;
    }
}

export default ListWidget;
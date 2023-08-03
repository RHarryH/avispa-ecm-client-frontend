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
import {Button, Table} from "react-bootstrap";

interface Value {
    key: string;
    value: string;
}
interface ListData {
    id: string;
    values: Value[];
}
interface ListDataProps {
    caption: string;
    typeName: string;
    isDocumentType: boolean;
    emptyMessage: string;
    headers: string[];
    data: ListData[];
}

interface ListWidgetProps {
    configuration?: string;
}

function ListWidget({configuration}:ListWidgetProps) {
    const [listWidgetData, setListWidgetData] = useState<ListDataProps>({
        caption: "Invoices",
        typeName: "Invoice",
        isDocumentType: true,
        emptyMessage: "Empty",
        headers: [],
        data: []
    });

    function fetchData() {
        return setListWidgetData({
            caption: "Invoices",
            typeName: "Invoice",
            isDocumentType: true,
            emptyMessage: "No Invoices Available",
            headers: [
                "Serial Number",
                "Invoice Name",
                "Issue Name",
                "Service Data",
                "Comments"
            ],
            data: [{
                id: "123",
                values: [
                    {
                        key: "Serial Number",
                        value: "1"
                    },
                    {
                        key: "Invoice Name",
                        value: "2"
                    },
                    {
                        key: "Issue Name",
                        value: "3"
                    },
                    {
                        key: "Service Data",
                        value: "4"
                    },
                    {
                        key: "Comments",
                        value: "5"
                    }
                ]
            }]
        })
    }

    useEffect(() => {
        return fetchData();
    }, []);

    const reloadData = useCallback(() => {
        return fetchData();
    }, []);

    const editRow = useCallback((rowId:string) => {
        return null;
    }, []);

    const deleteRow = useCallback((rowId:string) => {
        return null;
    }, []);

    const getRendition = useCallback((rowId:string) => {
        return null;
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
                            .map(header => (<th scope="col">{header}</th>))
                    }
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                    {
                        listWidgetData.isDocumentType ?
                            <th scope="col">Download</th> :
                            null
                    }
                </tr>
            </thead>
            <tbody>
                {
                    !listWidgetData.data.length ?
                        <tr><td colSpan={100}>{listWidgetData.emptyMessage}</td></tr> :
                        null
                }
                {
                    listWidgetData.data
                        .map(data =>
                            (<tr>
                                {
                                    data.values.map(value => (
                                        value.key !== "pdfRenditionAvailable" ?
                                            <td key={value.key}>{value.value}</td> :
                                            null
                                    ))
                                }
                                <td>
                                    <Button variant="" value={data.id} className="bi bi-pencil-fill" title={"Edit " + listWidgetData.typeName} onClick={e => editRow(data.id)}></Button>
                                </td>
                                <td>
                                    <Button variant="" value={data.id} className="bi bi-trash-fill" title={"Delete " + listWidgetData.typeName} onClick={e => deleteRow(data.id)}></Button>
                                </td>
                                {
                                    listWidgetData.isDocumentType ?
                                        (<td>
                                            {
                                                data.values.filter(value => value.key === "pdfRenditionAvailable").length ?
                                                <Button variant="" value={data.id} className="bi bi-file-earmark-arrow-down-fill" title="Download PDF rendition" onClick={e => getRendition(data.id)}></Button> :
                                                <></>
                                            }
                                        </td>):
                                        null
                                }
                            </tr>))
                }
            </tbody>
        </Table>
    </div>);
}

export default ListWidget;